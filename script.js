/* =============== DATA =============== */
const PRODUCTS=[
 {id:"rd100",name:"RD-100 Jewellery Balance",cap:"100 g",acc:"0.001 g (1 mg)",price:18500,tag:"MILLIGRAM",
  desc:"Our flagship milligram balance for hallmarked gold, diamonds and fine chains. Draft shield included; internal calibration weight; carat and tola modes built in.",
  specs:{"Capacity":"100 g / 500 ct","Readability":"0.001 g","Pan size":"Ø 80 mm, stainless steel","Modes":"g · ct · tola · mg","Calibration":"Internal + external 100 g E2 weight","Display":"Backlit green LCD","Power":"AC adapter + 8 hr battery","Approval":"Legal Metrology, Class II"}},
 {id:"rd300",name:"RD-300 Gold Scale",cap:"300 g",acc:"0.01 g",price:9800,tag:"COUNTER",
  desc:"The everyday counter scale for gold showrooms. Fast stabilisation under 2 seconds, dual display so the customer sees the same weight you do.",
  specs:{"Capacity":"300 g","Readability":"0.01 g","Pan size":"Ø 110 mm, stainless steel","Modes":"g · ct · tola","Display":"Dual — operator + customer","Stabilisation":"< 2 s","Power":"AC + rechargeable battery","Approval":"Legal Metrology, Class II"}},
 {id:"rd600",name:"RD-600 Silver Pro",cap:"600 g",acc:"0.01 g",price:12400,tag:"DUAL RANGE",
  desc:"Dual-range balance tuned for silver articles — ornaments on the fine range, utensils and payals on the full range, without switching machines.",
  specs:{"Capacity":"600 g (dual range 300/600)","Readability":"0.01 g / 0.02 g","Pan size":"Ø 130 mm","Modes":"g · tola · %","Tare":"Full-range tare","Display":"Backlit LCD","Power":"AC + battery","Approval":"Legal Metrology, Class II"}},
 {id:"rd1200",name:"RD-1200 Bullion Scale",cap:"1.2 kg",acc:"0.1 g",price:8200,tag:"BULLION",
  desc:"Built for bars and coins. Weighs a full kilo bar with headroom, with piece-counting for coin lots and a die-cast body that shrugs off daily mandi use.",
  specs:{"Capacity":"1200 g","Readability":"0.1 g","Pan size":"140 × 150 mm","Modes":"g · pcs · tola","Body":"Die-cast aluminium","Overload protection":"150%","Power":"AC + 30 hr battery","Approval":"Legal Metrology, Class III"}},
 {id:"rd50",name:"RD-50 Carat Balance",cap:"50 g / 250 ct",acc:"0.001 g",price:22000,tag:"STONES",
  desc:"For loose diamonds and precious stones. Glass draft shield on three sides, anti-vibration feet and a certificate-ready print port.",
  specs:{"Capacity":"50 g / 250 ct","Readability":"0.001 g / 0.005 ct","Draft shield":"3-side glass","Interface":"RS-232 printer port","Modes":"ct · g · mg · grain","Calibration":"Internal, motorised","Power":"AC adapter","Approval":"Legal Metrology, Class I"}},
 {id:"rd5k",name:"RD-5K Silver Bulk",cap:"5 kg",acc:"0.5 g",price:6500,tag:"WHOLESALE",
  desc:"Wholesale silver by the kilo — thalis, lots and scrap. Big stainless platform, bold LED digits readable across the counter.",
  specs:{"Capacity":"5 kg","Readability":"0.5 g","Platform":"230 × 190 mm stainless","Display":"25 mm red LED","Modes":"g · kg · tola","Tare":"Multi-tare","Power":"AC + 40 hr battery","Approval":"Legal Metrology, Class III"}}
];
const STATUSES=["Placed","Confirmed","Packed","Shipped","Delivered"];
const STATES=["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu & Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];
const ADMIN={email:"admin@ramdeep.com",pass:"admin123",name:"Ramdeep Admin"};
const inr=n=>"₹"+n.toLocaleString("en-IN");

/* =============== STORAGE (persists if available, else in-memory) =============== */
let DB={users:[],orders:[]};
let session=null, currentPd=null, qty=1, fpCode=null, fpEmail=null, pendingHash=null;
async function loadDB(){
  try{const r=localStorage.getItem("ramdeep-db"); if(r) DB=JSON.parse(r);}catch(e){/* first run */}
  try{const s=localStorage.getItem("ramdeep-session"); if(s) session=JSON.parse(s);}catch(e){}
}
async function saveDB(){ try{localStorage.setItem("ramdeep-db",JSON.stringify(DB));}catch(e){} }
async function saveSession(){ try{localStorage.setItem("ramdeep-session",JSON.stringify(session));}catch(e){} }

/* =============== SVG scale illustration =============== */
function scaleSVG(p,large){
  const readout=p.acc.startsWith("0.001")?"0.000":(p.acc.startsWith("0.1")?"0.0":(p.acc.startsWith("0.5")?"0.0":"0.00"));
  const h=large?230:160;
  return `<svg viewBox="0 0 300 ${h}" role="img" aria-label="${p.name}">
   <defs><linearGradient id="g${p.id}" x1="0" y1="0" x2="0" y2="1">
     <stop offset="0" stop-color="#3a4a44"/><stop offset="1" stop-color="#232f2a"/></linearGradient></defs>
   <ellipse cx="150" cy="${h-14}" rx="120" ry="8" fill="rgba(0,0,0,.35)"/>
   <circle cx="150" cy="${h-92}" r="46" fill="none" stroke="#5d6b63" stroke-width="3"/>
   <circle cx="150" cy="${h-92}" r="40" fill="url(#g${p.id})" stroke="#d8b872" stroke-width="1.4"/>
   <ellipse cx="150" cy="${h-100}" rx="30" ry="7" fill="#4c5a52"/>
   <rect x="70" y="${h-58}" width="160" height="36" rx="9" fill="url(#g${p.id})" stroke="#d8b872" stroke-width="1.4"/>
   <rect x="84" y="${h-49}" width="76" height="18" rx="3" fill="#0d1412" stroke="#39463f"/>
   <text x="122" y="${h-35.5}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="12.5" fill="#c9f2b0">${readout} g</text>
   <circle cx="176" cy="${h-40}" r="4.4" fill="#b08a3e"/><circle cx="192" cy="${h-40}" r="4.4" fill="#5d6b63"/>
   <circle cx="208" cy="${h-40}" r="4.4" fill="#5d6b63"/>
   <text x="150" y="${h-4}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="9" letter-spacing="2" fill="#8a6a28">RAMDEEP · ${p.cap.toUpperCase()}</text>
  </svg>`;
}

/* =============== ROUTER =============== */
const VIEWS=["home","product","checkout","confirm","track","login","signup","forgot","account","admin"];
function route(){
  const hash=(location.hash||"#home").slice(1);
  const [name,arg]=hash.split("/");
  let v=VIEWS.includes(name)?name:"home";
  if(v==="account"&&!session){location.hash="#login";return;}
  if(v==="admin"&&(!session||!session.isAdmin)){location.hash="#login";return;}
  if(v==="checkout"&&!session){pendingHash="#"+hash;loginNote("Please sign in or create an account to place your order.");location.hash="#login";return;}
  if(v==="checkout"&&!renderCheckout(arg)){v="home";}
  if(v==="product"&&!renderProduct(arg)){v="home";}
  if(v==="confirm") renderConfirm(arg);
  if(v==="account") renderAccount();
  if(v==="admin") renderAdmin();
  if(v==="forgot"){document.getElementById("fp1").style.display="block";document.getElementById("fp2").style.display="none";}
  VIEWS.forEach(x=>document.getElementById("view-"+x).classList.toggle("on",x===v));
  renderNav(v);
  window.scrollTo({top:0});
}
window.addEventListener("hashchange",route);
function scrollToShop(e){e.preventDefault();location.hash="#home";setTimeout(()=>document.getElementById("shopTop").scrollIntoView({behavior:"smooth"}),50);}

function renderNav(active){
  const n=document.getElementById("navLinks");
  let h=`<a href="#home" class="${active==="home"?"active":""}">Shop</a>
         <a href="#track" class="${active==="track"?"active":""}">Track order</a>`;
  if(session){
    if(session.isAdmin) h+=`<a href="#admin" class="${active==="admin"?"active":""}">Orders<span class="badge-admin">ADMIN</span></a>`;
    else h+=`<a href="#account" class="${active==="account"?"active":""}">My orders</a>`;
    h+=`<button onclick="logout()">Sign out (${session.name.split(" ")[0]})</button>`;
  }else{
    h+=`<a href="#login" class="nav-cta ${active==="login"?"active":""}">Sign in</a>`;
  }
  n.innerHTML=h;
}

/* =============== HOME =============== */
function renderGrid(){
  document.getElementById("productGrid").innerHTML=PRODUCTS.map(p=>`
   <article class="card">
     <a href="#product/${p.id}" class="art"><span class="cap">${p.tag}</span>${scaleSVG(p)}</a>
     <div class="body">
       <h3>${p.name}</h3>
       <p class="spec">${p.cap} capacity · ${p.acc} accuracy</p>
       <div class="row">
         <div class="price">${inr(p.price)}<small>incl. GST</small></div>
         <a class="btn btn-ink btn-sm" href="#product/${p.id}">View</a>
       </div>
     </div>
   </article>`).join("");
}

/* =============== PRODUCT DETAIL =============== */
function renderProduct(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p) return false;
  currentPd=p; qty=1;
  document.getElementById("pdCrumb").textContent=p.name;
  document.getElementById("pdBody").innerHTML=`
   <div class="art">${scaleSVG(p,true)}</div>
   <div>
     <p class="eyebrow">${p.tag} CLASS</p>
     <h1>${p.name}</h1>
     <div class="price">${inr(p.price)} <small style="font-size:12px;color:var(--muted)">incl. GST · free insured shipping</small></div>
     <p class="desc">${p.desc}</p>
     <div class="qty-row">
       <div class="qty"><button onclick="chQty(-1)" aria-label="Decrease quantity">−</button><span id="qtyN">1</span><button onclick="chQty(1)" aria-label="Increase quantity">+</button></div>
       <button class="btn btn-gold" style="flex:1" onclick="location.hash='#checkout/${p.id}'">Buy now — <span id="qtyPrice">${inr(p.price)}</span></button>
     </div>
     <div class="trust">
       <div><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>Stamped &amp; verified</div>
       <div><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="3" y="7" width="13" height="10" rx="2"/><path d="M16 10h3l2 3v4h-5M7.5 20a1.8 1.8 0 1 0 0-.01M17.5 20a1.8 1.8 0 1 0 0-.01"/></svg>Insured delivery</div>
       <div><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>2-year warranty</div>
     </div>
     <table class="spec-table">${Object.entries(p.specs).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</table>
   </div>`;
  return true;
}
function chQty(d){qty=Math.min(10,Math.max(1,qty+d));document.getElementById("qtyN").textContent=qty;document.getElementById("qtyPrice").textContent=inr(qty*currentPd.price);}

/* =============== CHECKOUT =============== */
function renderCheckout(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p) return false;
  currentPd=p;
  const ship=0, sub=p.price*qty;
  document.getElementById("coSummary").innerHTML=`
    <div class="li"><div class="mini">${scaleSVG(p)}</div>
      <div><b>${p.name}</b><span>${p.cap} · ${p.acc}</span><span>Qty ${qty} × ${inr(p.price)}</span></div></div>
    <div style="padding-top:12px">
      <div class="tot"><span>Subtotal</span><span class="mono">${inr(sub)}</span></div>
      <div class="tot"><span>Insured shipping</span><span>Free</span></div>
      <div class="tot grand"><span>Total payable</span><span>${inr(sub)}</span></div>
    </div>`;
  const sel=document.getElementById("c_state");
  if(sel.options.length<=1) STATES.forEach(s=>{const o=document.createElement("option");o.value=o.textContent=s;sel.appendChild(o);});
  if(session&&!session.isAdmin){
    const u=DB.users.find(x=>x.email===session.email);
    if(u){document.getElementById("c_name").value=u.name;document.getElementById("c_email").value=u.email;document.getElementById("c_phone").value=u.phone||"";}
  }
  return true;
}
async function placeOrder(){
  const g=id=>document.getElementById(id).value.trim();
  const err=document.getElementById("coErr");
  const name=g("c_name"),phone=g("c_phone"),email=g("c_email"),addr=g("c_addr"),city=g("c_city"),pin=g("c_pin"),state=g("c_state");
  const bad=m=>{err.textContent=m;err.classList.add("show");};
  err.classList.remove("show");
  if(!name) return bad("Please enter your full name.");
  if(!/^[6-9]\d{9}$/.test(phone)) return bad("Enter a valid 10-digit Indian mobile number.");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Enter a valid email address.");
  if(!addr) return bad("Please enter your delivery address.");
  if(!city) return bad("Please enter your city.");
  if(!/^\d{6}$/.test(pin)) return bad("PIN code must be 6 digits.");
  if(!state) return bad("Please select your state.");
  const order={
    id:"RD-"+Math.floor(100000+Math.random()*900000),
    productId:currentPd.id, product:currentPd.name, qty, unit:currentPd.price, total:currentPd.price*qty,
    customer:{name,phone,email,firm:g("c_firm"),gst:g("c_gst").toUpperCase(),addr,city,pin,state},
    notes:g("c_notes"), userEmail:session.email,
    status:"Placed", placedAt:new Date().toISOString(),
    history:[{status:"Placed",at:new Date().toISOString()}]
  };
  DB.orders.unshift(order); await saveDB();
  ["c_addr","c_city","c_pin","c_notes","c_firm","c_gst"].forEach(i=>document.getElementById(i).value="");
  location.hash="#confirm/"+order.id;
}
function renderConfirm(id){
  const o=DB.orders.find(x=>x.id===id); if(!o) return;
  document.getElementById("cfId").textContent=o.id;
  document.getElementById("cfMeta").textContent=`${o.product} × ${o.qty} · ${inr(o.total)} · to ${o.customer.city}, ${o.customer.state}`;
}

/* =============== TRACKING =============== */
function fmtDate(iso){return new Date(iso).toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});}
function timelineHTML(o){
  if(o.status==="Cancelled"){
    return `<ul class="timeline"><li class="done"><b>Placed</b><span>${fmtDate(o.placedAt)}</span></li>
      <li class="now"><b style="color:var(--bad)">Cancelled</b><span>${fmtDate(o.history[o.history.length-1].at)}</span></li></ul>`;
  }
  const idx=STATUSES.indexOf(o.status);
  return `<ul class="timeline">`+STATUSES.map((s,i)=>{
    const h=o.history.find(x=>x.status===s);
    const cls=i<idx?"done":(i===idx?"now done":"");
    return `<li class="${cls}"><b>${s}</b><span>${h?fmtDate(h.at):(i===idx+1?"Up next":"—")}</span></li>`;
  }).join("")+`</ul>`;
}
function trackOrder(){
  const id=document.getElementById("t_id").value.trim().toUpperCase();
  const ph=document.getElementById("t_phone").value.trim();
  const err=document.getElementById("tErr"), box=document.getElementById("tResult");
  err.classList.remove("show"); box.style.display="none";
  const o=DB.orders.find(x=>x.id===id);
  if(!o||o.customer.phone!==ph){err.textContent="No order found for that ID and mobile number. Check both and try again.";err.classList.add("show");return;}
  box.style.display="block";
  box.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
      <h2 style="font-size:20px">${o.id}</h2><span class="status-pill st-${o.status}">${o.status}</span></div>
    <p style="font-size:14px;color:var(--muted);margin-top:6px">${o.product} × ${o.qty} · ${inr(o.total)}</p>
    <p style="font-size:13px;color:var(--muted)">Deliver to: ${o.customer.name}, ${o.customer.city} ${o.customer.pin}</p>
    ${timelineHTML(o)}`;
}

/* =============== AUTH =============== */
function showErr(id,msg){const e=document.getElementById(id);e.textContent=msg;e.classList.add("show");}
function loginNote(msg){setTimeout(()=>{const n=document.getElementById("loginNote");if(n){n.textContent=msg;n.classList.add("show");}},60);}
function afterAuth(fallback){const go=pendingHash||fallback;pendingHash=null;location.hash=go;}
async function doSignup(){
  const name=document.getElementById("s_name").value.trim(),
        phone=document.getElementById("s_phone").value.trim(),
        email=document.getElementById("s_email").value.trim().toLowerCase(),
        pass=document.getElementById("s_pass").value;
  document.getElementById("sErr").classList.remove("show");
  if(!name) return showErr("sErr","Please enter your name.");
  if(!/^[6-9]\d{9}$/.test(phone)) return showErr("sErr","Enter a valid 10-digit mobile number.");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr("sErr","Enter a valid email.");
  if(email===ADMIN.email) return showErr("sErr","That email is reserved.");
  if(pass.length<6) return showErr("sErr","Password must be at least 6 characters.");
  if(DB.users.some(u=>u.email===email)) return showErr("sErr","An account with this email already exists — try signing in.");
  DB.users.push({name,phone,email,pass}); await saveDB();
  session={name,email,isAdmin:false}; await saveSession();
  afterAuth("#account");
}
async function doLogin(){
  const email=document.getElementById("l_email").value.trim().toLowerCase(),
        pass=document.getElementById("l_pass").value;
  document.getElementById("lErr").classList.remove("show");
  if(email===ADMIN.email&&pass===ADMIN.pass){
    session={name:ADMIN.name,email,isAdmin:true}; await saveSession(); location.hash="#admin"; return;
  }
  const u=DB.users.find(x=>x.email===email&&x.pass===pass);
  if(!u) return showErr("lErr","Email or password is incorrect. Use “Forgot password?” if you need to reset it.");
  session={name:u.name,email:u.email,isAdmin:false}; await saveSession();
  document.getElementById("l_pass").value="";
  afterAuth("#account");
}
async function logout(){session=null; await saveSession(); location.hash="#home"; route();}

/* ----- forgot password ----- */
function fpSendCode(){
  const email=document.getElementById("f_email").value.trim().toLowerCase();
  document.getElementById("fErr1").classList.remove("show");
  const u=DB.users.find(x=>x.email===email);
  if(!u) return showErr("fErr1","No account found with that email.");
  fpEmail=email; fpCode=String(Math.floor(100000+Math.random()*900000));
  document.getElementById("fCodeNote").textContent="Demo mode — your reset code is "+fpCode+" (in production this would be emailed/SMSed to you).";
  document.getElementById("fp1").style.display="none";
  document.getElementById("fp2").style.display="block";
}
async function fpReset(){
  const code=document.getElementById("f_code").value.trim(),
        p1=document.getElementById("f_new").value, p2=document.getElementById("f_new2").value;
  document.getElementById("fErr2").classList.remove("show");
  if(code!==fpCode) return showErr("fErr2","That reset code doesn't match.");
  if(p1.length<6) return showErr("fErr2","New password must be at least 6 characters.");
  if(p1!==p2) return showErr("fErr2","Passwords don't match.");
  const u=DB.users.find(x=>x.email===fpEmail); u.pass=p1; await saveDB();
  fpCode=null; ["f_code","f_new","f_new2","f_email"].forEach(i=>document.getElementById(i).value="");
  alert("Password updated. Please sign in with your new password.");
  location.hash="#login";
}

/* =============== MY ACCOUNT =============== */
function renderAccount(){
  document.getElementById("accHello").textContent="Signed in as "+session.name;
  const mine=DB.orders.filter(o=>o.userEmail===session.email);
  const body=document.getElementById("accBody");
  if(!mine.length){
    body.innerHTML=`<div class="tablewrap"><div class="empty">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#8f989b" stroke-width="1.6"><path d="M6 7h12l1 13H5L6 7z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>
      No orders yet. Pick a scale from the catalogue to place your first order.<br><br>
      <a class="btn btn-gold btn-sm" href="#home">Browse scales</a></div></div>`;
    return;
  }
  body.innerHTML=`<div class="tablewrap"><table class="list">
    <thead><tr><th>Order</th><th>Item</th><th>Total</th><th>Status</th><th>Progress</th></tr></thead>
    <tbody>${mine.map(o=>`<tr>
      <td class="mono"><b>${o.id}</b><br><span style="color:var(--muted)">${fmtDate(o.placedAt)}</span></td>
      <td>${o.product}<br><span class="mono" style="color:var(--muted)">Qty ${o.qty}</span></td>
      <td class="mono">${inr(o.total)}</td>
      <td><span class="status-pill st-${o.status}">${o.status}</span></td>
      <td>${timelineHTML(o)}</td></tr>`).join("")}</tbody></table></div>`;
}

/* =============== ADMIN =============== */
function renderAdmin(){
  const os=DB.orders;
  const rev=os.filter(o=>o.status!=="Cancelled").reduce((a,o)=>a+o.total,0);
  const pending=os.filter(o=>!["Delivered","Cancelled"].includes(o.status)).length;
  const delivered=os.filter(o=>o.status==="Delivered").length;
  document.getElementById("adminStats").innerHTML=`
    <div class="stat"><b>${os.length}</b><span>Total orders</span></div>
    <div class="stat gold"><b>${inr(rev)}</b><span>Order value</span></div>
    <div class="stat"><b>${pending}</b><span>In progress</span></div>
    <div class="stat"><b>${delivered}</b><span>Delivered</span></div>`;
  const body=document.getElementById("adminBody");
  if(!os.length){
    body.innerHTML=`<div class="tablewrap"><div class="empty">No orders have been placed yet. New orders will appear here the moment a customer checks out.</div></div>`;
    return;
  }
  body.innerHTML=`<div class="tablewrap"><table class="list">
   <thead><tr><th>Order</th><th>Customer</th><th>Item</th><th>Total</th><th>Status</th></tr></thead>
   <tbody>${os.map(o=>`<tr>
     <td class="mono"><b>${o.id}</b><br><span style="color:var(--muted)">${fmtDate(o.placedAt)}</span></td>
     <td><b>${o.customer.name}</b><br><span class="mono" style="font-size:12px">${o.customer.phone}</span><br><span style="font-size:12px;color:var(--muted)">${o.customer.email}</span>
       <details class="odet"><summary>Full details</summary><div class="box">
         ${o.customer.firm?`<b>Firm:</b> ${o.customer.firm}<br>`:""}${o.customer.gst?`<b>GSTIN:</b> <span class="mono">${o.customer.gst}</span><br>`:""}
         <b>Address:</b> ${o.customer.addr}, ${o.customer.city}, ${o.customer.state} — ${o.customer.pin}
         ${o.notes?`<br><b>Notes:</b> ${o.notes}`:""}</div></details></td>
     <td>${o.product}<br><span class="mono" style="color:var(--muted)">Qty ${o.qty} × ${inr(o.unit)}</span></td>
     <td class="mono"><b>${inr(o.total)}</b></td>
     <td><span class="status-pill st-${o.status}">${o.status}</span><br>
       <select style="margin-top:8px;padding:7px 9px;font-size:13px" onchange="setStatus('${o.id}',this.value)">
         ${[...STATUSES,"Cancelled"].map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}
       </select></td></tr>`).join("")}</tbody></table></div>`;
}
async function setStatus(id,status){
  const o=DB.orders.find(x=>x.id===id); if(!o) return;
  o.status=status;
  if(!o.history.some(h=>h.status===status)) o.history.push({status,at:new Date().toISOString()});
  await saveDB(); renderAdmin();
}

/* =============== hero readout animation =============== */
function animateHero(){
  const el=document.getElementById("heroNum");
  const seq=["0.000","4.972","4.973","4.973","0.000","11.664","11.664","0.000"];let i=0;
  setInterval(()=>{i=(i+1)%seq.length;el.innerHTML=seq[i]+"<small> g</small>";},1600);
}

/* =============== INIT =============== */
(async function(){
  await loadDB();
  renderGrid(); animateHero(); route();
})();
