// 링크 미리보기 이미지(og-image.jpg, 1200x630) 생성: 앱의 실제 명찰 렌더러로 3장을 그려 합성한다.
// 사용: npm i playwright-core  →  node tools/make_og_image.js "file:///<경로>/index.html" og-image.jpg
// (Edge 설치 필요. 디자인·문구를 바꾸면 다시 실행하고 커밋)
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto(process.argv[2]);await p.waitForTimeout(2500);await p.evaluate(()=>{try{closeUpdateModal()}catch(e){}});
  const url=await p.evaluate(async()=>{
    document.getElementById('ev-inp').value='MIDAS SQUARE 2026';
    const people=[{bg:2,style:'foreign',r:{first:'Heung Min',last:'Son',affil:'MIDAS IT'}},
                  {bg:1,style:'kr',r:{first:'西',last:'梅',affil:'邁達斯'}},
                  {bg:0,style:'kr',r:{first:'민재',last:'김',affil:'마이다스아이티'}}];
    pdfDpi=200;const imgs=[];
    for(const x of people){selBg(x.bg,true);switchNameStyle(x.style);await document.fonts.ready;
      await prepareFontsFor([{...x.r,event:'MIDAS SQUARE 2026'}]);
      const u=await renderCanvasImage({...x.r,event:'MIDAS SQUARE 2026'});const im=new Image();im.src=u;await im.decode();imgs.push(im);}
    const W=1200,H=630,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
    const bgG=g.createLinearGradient(0,0,W,H);bgG.addColorStop(0,'#0B1220');bgG.addColorStop(1,'#0E2A22');g.fillStyle=bgG;g.fillRect(0,0,W,H);
    const glow=g.createRadialGradient(900,320,40,900,320,520);glow.addColorStop(0,'rgba(16,185,129,.28)');glow.addColorStop(1,'rgba(16,185,129,0)');g.fillStyle=glow;g.fillRect(0,0,W,H);
    // 명찰 3장 (뒤 → 앞)
    const bw=232,bh=Math.round(bw*imgs[0].height/imgs[0].width);
    const place=[[1055,300,8],[672,330,-8],[868,345,0]];
    [1,0,2].forEach((k,j)=>{const [cx,cy,deg]=place[j];g.save();g.translate(cx,cy);g.rotate(deg*Math.PI/180);
      g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=36;g.shadowOffsetY=14;g.fillStyle='#000';g.fillRect(-bw/2,-bh/2,bw,bh);g.shadowColor='transparent';
      g.drawImage(imgs[k],-bw/2,-bh/2,bw,bh);g.restore();});
    // 글자
    g.fillStyle='#34D399';g.font="700 24px 'Pretendard'";g.fillText('RPM 추진실 · 디자인팀',72,150);
    g.fillStyle='#fff';g.font="800 76px 'Pretendard'";g.fillText('명찰 생성기',68,240);
    g.fillStyle='rgba(255,255,255,.82)';g.font="500 30px 'Pretendard'";
    g.fillText('명단만 올리면 수백 명의 명찰을',72,306);g.fillText('한 번에 인쇄용 PDF로',72,348);
    const chips=['구글 시트','엑셀 · CSV','한글 · 中文 · English','300 DPI PDF'];let x=72,y=420;g.font="600 21px 'Pretendard'";
    chips.forEach((t,i)=>{const w=g.measureText(t).width+32;if(x+w>560){x=72;y+=52;}
      g.fillStyle='rgba(255,255,255,.08)';g.strokeStyle='rgba(255,255,255,.22)';g.lineWidth=1.5;g.beginPath();g.roundRect(x,y,w,40,20);g.fill();g.stroke();
      g.fillStyle='#E5FFF5';g.fillText(t,x+16,y+27);x+=w+10;});
    g.fillStyle='rgba(255,255,255,.45)';g.font="500 20px 'Pretendard'";g.fillText('rpm-name-tag.vercel.app',72,575);
    return c.toDataURL('image/jpeg',0.92);});
  fs.writeFileSync(process.argv[3],Buffer.from(url.split(',')[1],'base64'));console.log('saved',process.argv[3]);await b.close();})();
