import * as THREE from 'three';

// Fictional films; replace this array with your own library.
export const library = [
  {title:'AFTER HOURS',year:'1988',genre:'Thriller',color:'#24364b',ink:'#ebdcc7',description:'One last train. A city that never quite lets you go.'},
  {title:'DESERT RADIO',year:'1991',genre:'Road movie',color:'#d89550',ink:'#362b26',description:'Two strangers follow a fading radio signal across the desert.'},
  {title:'THE BLUE ROOM',year:'1986',genre:'Mystery',color:'#467881',ink:'#e9e6d6',description:'Behind a familiar door, an unfamiliar memory waits.'},
  {title:'SUMMER OF 89',year:'1989',genre:'Coming of age',color:'#ece0bd',ink:'#ba513a',description:'A borrowed car, a mixtape, and a summer with nowhere to be.'},
  {title:'NIGHT SHIFT',year:'1993',genre:'Sci-fi',color:'#292b30',ink:'#dc614c',description:'The overnight crew discovers something moving beneath the station.'},
  {title:'WILD COAST',year:'1990',genre:'Adventure',color:'#658273',ink:'#f5e8cd',description:'An old map leads three friends to the edge of the known world.'},
  {title:'MOON MOTEL',year:'1987',genre:'Drama',color:'#b4523d',ink:'#f2d6a7',description:'A roadside motel becomes a brief home for passing lives.'},
  {title:'LOST SIGNAL',year:'1994',genre:'Sci-fi',color:'#dbceb6',ink:'#3c5867',description:'A transmission from tomorrow arrives on an obsolete television.'},
  {title:'SLOW SUNDAY',year:'1992',genre:'Drama',color:'#c8b298',ink:'#453929',description:'Small conversations change everything on an ordinary Sunday.'},
  {title:'DEEP WATER',year:'1985',genre:'Thriller',color:'#283f47',ink:'#c5d6d0',description:'A diver finds a secret that should have stayed underwater.'},
  {title:'NEON HEART',year:'1990',genre:'Romance',color:'#ab6875',ink:'#f9dfcc',description:'Two night owls find each other in the glow of a restless city.'},
  {title:'ORBITAL',year:'1996',genre:'Sci-fi',color:'#d4d5c4',ink:'#3f5953',description:'Alone above Earth, an astronaut hears a knock on the airlock.'},
  {title:'THE LONG WAY',year:'1988',genre:'Road movie',color:'#bc854b',ink:'#f5e7cc',description:'The detour turns out to be the journey they needed.'},
  {title:'GHOST TOWN',year:'1991',genre:'Mystery',color:'#55534f',ink:'#eee5cf',description:'Every house is empty. Every telephone is ringing.'},
  {title:'GOLDEN DAYS',year:'1984',genre:'Comedy',color:'#d5b46b',ink:'#51392c',description:'A small-town cinema stages one very improbable comeback.'},
  {title:'HOME VIDEO',year:'1995',genre:'Documentary',color:'#e5dcca',ink:'#6a665c',description:'A collection of little moments, kept for no particular reason.'}
];

/** Mount a cassette selector. Physical proportions: 187 × 103 × 25 model units. */
export function mountVhsSelector(container,{onSelect=()=>{}}={}) {
  const scene=new THREE.Scene();scene.background=new THREE.Color('white');
  const camera=new THREE.PerspectiveCamera(30,1,.1,80);
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  container.append(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff,0xb0b2b5,2.1));
  const light=new THREE.DirectionalLight(0xffffff,3.0);light.position.set(-3,7,6);light.castShadow=true;
  light.shadow.mapSize.set(2048,2048);Object.assign(light.shadow.camera,{left:-8,right:8,top:6,bottom:-6,near:.1,far:25});light.shadow.normalBias=.008;scene.add(light);
  const fill=new THREE.DirectionalLight(0xdbe4f0,1.1);fill.position.set(5,2,-4);scene.add(fill);
  const textures=[];let seed=97;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  function texture(draw,w=1024,h=512){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;draw(canvas.getContext('2d'),w,h);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();textures.push(t);return t;}
  const grain=texture((c,w,h)=>{c.fillStyle='#343436';c.fillRect(0,0,w,h);for(let i=0;i<11000;i++){const v=Math.floor(30+random()*65);c.fillStyle=`rgba(${v},${v},${v},.18)`;c.fillRect(random()*w,random()*h,random()*25+1,.5);}for(let i=0;i<70;i++){c.strokeStyle='rgba(160,160,155,.12)';c.lineWidth=.5;c.beginPath();const x=random()*w,y=random()*h;c.moveTo(x,y);c.lineTo(x+random()*100,y+random()*2);c.stroke();}});
  const plastic=new THREE.MeshStandardMaterial({color:'#aaaaac',map:grain,roughness:.48,bumpMap:grain,bumpScale:.002});
  const edge=new THREE.MeshStandardMaterial({color:'#19191b',roughness:.46});
  const rim=new THREE.MeshStandardMaterial({color:'#414143',roughness:.42});
  const tapeMat=new THREE.MeshStandardMaterial({color:'#302d2c',roughness:.36});
  const hub=new THREE.MeshStandardMaterial({color:'#c8c7be',roughness:.37});
  const glass=new THREE.MeshPhysicalMaterial({color:'#b9c4cb',transparent:true,opacity:.18,roughness:.12,metalness:.1,depthWrite:false});
  function box(parent,w,h,d,mat,x=0,y=0,z=0){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  function roundedShape(w,h,r,x=0,y=0,Path=THREE.Shape){const s=new Path();s.moveTo(x-w/2+r,y-h/2);s.lineTo(x+w/2-r,y-h/2);s.quadraticCurveTo(x+w/2,y-h/2,x+w/2,y-h/2+r);s.lineTo(x+w/2,y+h/2-r);s.quadraticCurveTo(x+w/2,y+h/2,x+w/2-r,y+h/2);s.lineTo(x-w/2+r,y+h/2);s.quadraticCurveTo(x-w/2,y+h/2,x-w/2,y+h/2-r);s.lineTo(x-w/2,y-h/2+r);s.quadraticCurveTo(x-w/2,y-h/2,x-w/2+r,y-h/2);return s;}
  function rounded(parent,w,h,depth,mat,x,y,z,r=.02){const geo=new THREE.ExtrudeGeometry(roundedShape(w,h,r),{depth,bevelEnabled:true,bevelSize:.004,bevelThickness:.003,bevelSegments:2,steps:1,curveSegments:8});const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z-depth/2);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function plane(parent,w,h,map,x,y,z){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map,roughness:.8}));m.position.set(x,y,z);parent.add(m);return m;}
  function label(t,i,spine){return texture((c,w,h)=>{c.fillStyle=i%4===1?'#d4c7ae':'#e7e4d9';c.fillRect(0,0,w,h);for(let n=0;n<5000;n++){c.fillStyle=random()>.5?'rgba(90,65,25,.03)':'rgba(255,255,255,.12)';c.fillRect(random()*w,random()*h,2,2);}const accent=['#bb5546','#355774','#a07736','#555c51'][i%4];
    if(spine){c.strokeStyle='#afa897';c.lineWidth=2;c.strokeRect(9,9,w-18,h-18);c.fillStyle=accent;c.fillRect(w-105,0,105,h);c.fillStyle='#31302d';c.font='italic 46px Georgia';c.fillText(t.title,28,h*.63,w-155);c.fillStyle='#ede5d8';c.font='bold 20px Arial';c.fillText('VHS',w-82,h*.48);c.font='15px monospace';c.fillText('E-120',w-85,h*.72);}
    else{c.fillStyle=accent;c.fillRect(0,h-58,w,58);c.font='15px Arial';c.fillText('□ SP  □ LP  |  □ MONO  □ STEREO',24,30);c.fillRect(0,43,w,2);c.strokeStyle='#c8bcb0';c.setLineDash([2,6]);for(let y=90;y<h-60;y+=45){c.beginPath();c.moveTo(25,y);c.lineTo(w-25,y);c.stroke();}c.fillStyle='#34383e';c.font='italic 40px Georgia';const words=t.title.split(' ');c.fillText(words.slice(0,-1).join(' '),29,119);c.fillText(words.at(-1),29,168);c.font='italic 18px Georgia';c.fillText(t.year+' / '+t.genre,29,215);c.fillStyle='#ece4dc';c.font='bold 15px Arial';c.fillText('VIDEO CASSETTE',24,h-23);c.textAlign='right';c.fillText('VHS',w-22,h-23);}
  },spine?1024:600,spine?112:340);}
  const tapes=library.map((t,i)=>{
    const g=new THREE.Group();g.userData.index=i;scene.add(g);
    // A rounded shell with actual openings over modeled magnetic reels.
    rounded(g,1.87,1.03,.16,plastic,0,0,-.045,.035);
    const face=roundedShape(1.84,.99,.027);
    for(const x of [-.636,.636])face.holes.push(roundedShape(.42,.475,.04,x,-.055,THREE.Path));
    const panel=new THREE.Mesh(new THREE.ExtrudeGeometry(face,{depth:.027,bevelEnabled:true,bevelSize:.005,bevelThickness:.003,bevelSegments:2,curveSegments:10}),plastic);panel.position.z=.081;panel.castShadow=true;panel.receiveShadow=true;g.add(panel);
    [-.46,.46].forEach((x,j)=>{
      const spool=new THREE.Mesh(new THREE.CylinderGeometry(j===0?.36:.33,j===0?.36:.33,.028,64),tapeMat);spool.rotation.x=Math.PI/2;spool.position.set(x,-.055,.041);g.add(spool);
      for(let k=0;k<12;k++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.18+k*.012,.001,3,64),rim);ring.position.set(x,-.055,.058);g.add(ring);}
      const reel=new THREE.Mesh(new THREE.RingGeometry(.041,.119,48),hub);reel.position.set(x,-.055,.062);g.add(reel);
      const hole=new THREE.Mesh(new THREE.CircleGeometry(.041,32),edge);hole.position.set(x,-.055,.064);g.add(hole);
      for(let k=0;k<6;k++){const a=k*Math.PI/3;const spoke=box(g,.017,.068,.007,hub,x+Math.cos(a)*.081,-.055+Math.sin(a)*.081,.067);spoke.rotation.z=a-Math.PI/2;}
      rounded(g,.408,.461,.004,glass,j===0?-.636:.636,-.055,.117,.035);
    });
    rounded(g,.8,.482,.01,edge,0,-.055,.112,.025);plane(g,.762,.444,label(t,i,false),0,-.055,.129);
    // Hinged dust door, seam, recessed long edge label, ribs and screws.
    rounded(g,1.85,.104,.238,edge,0,.46,0,.012);
    const spine=plane(g,1.68,.162,label(t,i,true),0,-.53,0);spine.rotation.x=Math.PI/2;
    for(let k=0;k<18;k++){box(g,.013,.10,.003,rim,-.79+k*.019,-.378,.113);box(g,.013,.10,.003,rim,.47+k*.019,-.378,.113);}
    for(const x of [-.82,.82])for(const y of [-.42,.39]){const screw=new THREE.Mesh(new THREE.CircleGeometry(.014,16),edge);screw.position.set(x,y,.116);g.add(screw);box(g,.018,.002,.002,rim,x,y,.118);}
    for(const x of [-.74,.74]){const arrow=new THREE.Shape();arrow.moveTo(-.033,0);arrow.lineTo(0,.035);arrow.lineTo(.033,0);arrow.lineTo(.014,0);arrow.lineTo(.014,-.024);arrow.lineTo(-.014,-.024);arrow.lineTo(-.014,0);arrow.closePath();const a=new THREE.Mesh(new THREE.ShapeGeometry(arrow),rim);a.position.set(x,.315,.116);g.add(a);}
    const badge=texture((c,w,h)=>{c.fillStyle='#29292b';c.fillRect(0,0,w,h);c.strokeStyle='#454547';c.lineWidth=8;c.strokeRect(7,7,w-14,h-14);c.fillStyle='#454547';c.font='bold 72px Arial';c.textAlign='center';c.fillText('VHS',w/2,95);},256,128);plane(g,.097,.048,badge,0,.315,.116);
    g.userData.home=new THREE.Vector3((i-7.5)*.32,0,0);g.position.copy(g.userData.home);
    // Keep the long label edge toward the viewer, and show the broad cassette face on extraction.
    g.userData.rest=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,-Math.PI/2,Math.PI/2,'YXZ'));g.quaternion.copy(g.userData.rest);
    return g;
  });
  // Invisible white stage; only the soft contact shadow is visible.
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({opacity:.10}));ground.rotation.x=-Math.PI/2;ground.position.y=-.951;ground.receiveShadow=true;scene.add(ground);
  let selected=null,hovered=null,raf=0,disposed=false,tiltX=0,tiltY=0;let phase=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),target=new THREE.Vector3(),q=new THREE.Quaternion(),clock=new THREE.Clock();
  let width=1,height=1,visibleWidth=8;
  function resize(){width=container.clientWidth;height=container.clientHeight;camera.aspect=width/height;renderer.setSize(width,height);const vh=Math.max(5.6,6.2/camera.aspect);visibleWidth=vh*camera.aspect; const spacing=Math.max(.285,(visibleWidth*.84-.25)/15);tapes.forEach((t,i)=>t.userData.home.x=(i-7.5)*spacing);const distance=vh/(2*Math.tan(THREE.MathUtils.degToRad(15)));camera.position.set(.25,1.45,distance);camera.lookAt(0,0,0);camera.updateProjectionMatrix();}
  const observer=new ResizeObserver(resize);observer.observe(container);resize();
  function pick(e){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(tapes,true)[0]?.object;if(!hit)return null;let o=hit;while(o.parent&&o.userData.index===undefined)o=o.parent;return o.userData.index===undefined?null:o;}
  function move(e){const hit=pick(e);hovered=hit?hit.userData.index:null;container.style.cursor=hit?'pointer':'default';tiltX=-pointer.y*.17;tiltY=pointer.x*.20;}
  function select(index){if(index!==null&&(!Number.isInteger(index)||index<0||index>=tapes.length))return;selected=index;phase=0;onSelect(index);}
  function click(e){const hit=pick(e);select(hit?(selected===hit.userData.index?null:hit.userData.index):null);}
  function leave(){hovered=null;tiltX=tiltY=0;container.style.cursor='default';}
  renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerleave',leave);renderer.domElement.addEventListener('click',click);
  function animate(){if(disposed)return;raf=requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05),a=reduced?1:1-Math.exp(-dt*9);phase+=dt;
    tapes.forEach((m,i)=>{const active=selected===i;target.copy(m.userData.home);q.copy(m.userData.rest);
      if(active){const narrow=width/height<1;target.set(narrow?1.0:visibleWidth*.205,narrow?-1.55:.20,2.8);if(phase<.18&&!reduced){target.copy(m.userData.home);target.z=1.8;}else q.setFromEuler(new THREE.Euler(-.08+(hovered===i?tiltX:0),-.20+(hovered===i?tiltY:0),-.04,'YXZ'));}
      else if(selected!==null){target.x=target.x*.62-visibleWidth*.17;target.z=-.2;}
      if(!active&&hovered===i){target.z+=.44;}
      m.position.lerp(target,a);m.quaternion.slerp(q,a);
    });renderer.render(scene,camera);
  }animate();
  return {select,dispose(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('click',click);scene.traverse(o=>{o.geometry?.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());});textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();container.style.cursor='';}};
}


