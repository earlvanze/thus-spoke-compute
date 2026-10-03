#!/usr/bin/env python3
"""Map a canonical lyric sheet to local whisper.cpp word timestamps.

This is a reproducible reconciliation layer: Whisper supplies acoustic timing;
the canonical sheet retains the chosen lyric spelling and line structure.
"""
from __future__ import annotations
import argparse, difflib, json, re
from pathlib import Path

WORD = re.compile(r"[a-z0-9]+")
def norm(s: str) -> str:
    return ''.join(WORD.findall(s.lower().replace("'", '')))
def parse_sheet(path: Path):
    section='intro'; lines=[]
    for raw in path.read_text().splitlines():
        raw=raw.strip()
        if not raw or raw.startswith('#'): continue
        m=re.fullmatch(r'\[([^]]+)\]',raw)
        if m: section=m.group(1); continue
        ws=[w for w in re.findall(r"[\w']+",raw) if norm(w)]
        lines.append({'text':raw,'section':section,'words':[{'w':w} for w in ws]})
    return lines
def stamp(v):
    h,m,sms=v.split(':'); s,ms=sms.split(',')
    return int(h)*3600+int(m)*60+int(s)+int(ms)/1000
def read_whisper(path:Path):
    r=[]
    for seg in json.loads(path.read_text())['transcription']:
        for t in seg.get('tokens',[]):
            x=t.get('text','').strip()
            if x.startswith('[_') or not norm(x): continue
            # split tokenizer fragments, retaining a proportioned timestamp.
            parts=re.findall(r"[A-Za-z0-9']+",x)
            a=stamp(t['timestamps']['from']); b=stamp(t['timestamps']['to'])
            for i,p in enumerate(parts):
                r.append({'w':p,'n':norm(p),'start':a+(b-a)*i/len(parts),'end':a+(b-a)*(i+1)/len(parts),'p':t.get('p',0)})
    return r
def sim(a,b): return difflib.SequenceMatcher(None,a,b).ratio()
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('lyrics'); ap.add_argument('whisper_json'); ap.add_argument('output'); a=ap.parse_args()
    lines=parse_sheet(Path(a.lyrics)); flat=[(li,wi,w['w'],norm(w['w'])) for li,L in enumerate(lines) for wi,w in enumerate(L['words'])]
    heard=read_whisper(Path(a.whisper_json)); n,m=len(flat),len(heard)
    # Needleman-Wunsch, deliberately cheap to skip an ASR hallucination and expensive to discard a canonical word.
    gap_c,gap_a=2.2,0.42
    dp=[[0.]*(m+1) for _ in range(n+1)]; bt=[[None]*(m+1) for _ in range(n+1)]
    for i in range(1,n+1): dp[i][0]=i*gap_c; bt[i][0]='C'
    for j in range(1,m+1): dp[0][j]=j*gap_a; bt[0][j]='A'
    for i in range(1,n+1):
        an=flat[i-1][3]
        for j in range(1,m+1):
            q=sim(an,heard[j-1]['n'])
            match=-3.5 if q==1 else (-1.8 if q>=.76 else (0.2 if q>=.5 else 2.4))
            opts=((dp[i-1][j-1]+match,'M'),(dp[i-1][j]+gap_c,'C'),(dp[i][j-1]+gap_a,'A'))
            dp[i][j],bt[i][j]=min(opts,key=lambda z:z[0])
    mapping=[None]*n; i,j=n,m
    while i or j:
        z=bt[i][j]
        if z=='M':
            q=sim(flat[i-1][3],heard[j-1]['n'])
            if q>=.5: mapping[i-1]=(heard[j-1],q)
            i-=1;j-=1
        elif z=='C': i-=1
        else: j-=1
    # Fill unmatched canonical words only between acoustic neighbours; never invent a global shift.
    starts=[x[0]['start'] if x else None for x in mapping]
    matched=sum(x is not None for x in mapping)
    for k in range(n):
        if mapping[k]: continue
        left=next((q for q in range(k-1,-1,-1) if starts[q] is not None),None)
        right=next((q for q in range(k+1,n) if starts[q] is not None),None)
        if left is not None and right is not None:
            starts[k]=starts[left]+(starts[right]-starts[left])*(k-left)/(right-left)
        elif left is not None: starts[k]=starts[left]+.18*(k-left)
        elif right is not None: starts[k]=max(0,right*.0+starts[right]-.18*(right-k))
        else: starts[k]=0.
    for k,(li,wi,w,_) in enumerate(flat):
        lines[li]['words'][wi]['start']=round(starts[k],3)
        lines[li]['words'][wi]['conf']=round(mapping[k][1] if mapping[k] else 0.,3)
    for L in lines:
        for i,w in enumerate(L['words']):
            nxt=L['words'][i+1]['start'] if i+1<len(L['words']) else w['start']+.32
            w['end']=round(max(w['start']+.06,nxt-.01),3)
        L['start']=L['words'][0]['start']; L['end']=L['words'][-1]['end']
    # Prevent lyric plates overlapping if Whisper attached a late repeated phrase to its neighbour.
    for x,y in zip(lines,lines[1:]):
        if x['end'] >= y['start']:
            x['end']=x['words'][-1]['end']=round(max(x['words'][-1]['start']+.06,y['start']-.01),3)
    data={'lines':lines,'notes':f'Local whisper.cpp large-v3-turbo acoustic word timing; canonical lyrics reconciled by sequence alignment. {matched}/{n} canonical words acoustically matched; unmatched words interpolated only within adjacent acoustic anchors.'}
    Path(a.output).write_text(json.dumps(data,indent=1)+'\n')
    print(f'{matched}/{n} canonical words directly matched to Whisper; {n-matched} interpolated')
if __name__=='__main__': main()
