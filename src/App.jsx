import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ─── CSS Property + Value Database ───────────────────────────────────────────
const CSS_DB = [
  { k: "font-size",             cat: "Typography", hint: "1rem / 16px / 1.2em",       values: ["0.75rem","0.875rem","1rem","1.125rem","1.25rem","1.5rem","1.75rem","2rem","2.5rem","3rem","4rem","clamp(1rem,2vw,2rem)"] },
  { k: "font-family",           cat: "Typography", hint: "Georgia, serif",             values: ["Georgia, serif","'Palatino Linotype', serif","'Times New Roman', serif","Garamond, serif","Verdana, sans-serif","Tahoma, sans-serif","'Trebuchet MS', sans-serif","'Courier New', monospace","Impact, sans-serif"] },
  { k: "font-weight",           cat: "Typography", hint: "400 / 700 / bold",           values: ["100","200","300","400","500","600","700","800","900","bold","normal","lighter","bolder"] },
  { k: "font-style",            cat: "Typography", hint: "italic / normal",            values: ["normal","italic","oblique"] },
  { k: "line-height",           cat: "Typography", hint: "1.5 / 2rem",                 values: ["1","1.2","1.4","1.5","1.6","1.75","2","2.5","normal"] },
  { k: "letter-spacing",        cat: "Typography", hint: "0.05em / 2px",               values: ["-0.05em","-0.03em","0","0.02em","0.05em","0.08em","0.1em","0.15em","0.2em","2px","4px"] },
  { k: "text-align",            cat: "Typography", hint: "left / center / right",      values: ["left","center","right","justify","start","end"] },
  { k: "text-decoration",       cat: "Typography", hint: "none / underline",           values: ["none","underline","overline","line-through","underline dotted","underline wavy #e85d04"] },
  { k: "text-transform",        cat: "Typography", hint: "uppercase / lowercase",      values: ["none","uppercase","lowercase","capitalize"] },
  { k: "text-shadow",           cat: "Typography", hint: "2px 2px 4px rgba(0,0,0,.3)",values: ["none","1px 1px 2px rgba(0,0,0,0.2)","2px 2px 4px rgba(0,0,0,0.3)","0 0 8px rgba(255,255,255,0.8)","0 2px 4px rgba(0,0,0,0.5)"] },
  { k: "white-space",           cat: "Typography", hint: "nowrap / pre / normal",      values: ["normal","nowrap","pre","pre-wrap","pre-line","break-spaces"] },
  { k: "word-break",            cat: "Typography", hint: "break-all / normal",         values: ["normal","break-all","keep-all","break-word"] },

  { k: "color",                 cat: "Color",     hint: "#333 / rgba(0,0,0,0.8)",     values: ["#0000x00","#ffffff","#333333","#666666","#999999","#e85d04","#f59e0b","#22c55e","#3b82f6","#a855f7","#ef4444","#ec4899","currentColor","transparent","inherit"] },
  { k: "background",            cat: "Color",     hint: "#fff / linear-gradient(…)",  values: ["transparent","#ffffff","#f8f8f8","#f0f0f0","#1a1a1a","#0f0f0f","linear-gradient(135deg,#667eea,#764ba2)","linear-gradient(to right,#f093fb,#f5576c)","linear-gradient(to bottom,#ffecd2,#fcb69f)","radial-gradient(circle,#667eea,#764ba2)"] },
  { k: "background-color",      cat: "Color",     hint: "#f0f0f0 / transparent",      values: ["transparent","#ffffff","#f8f9fa","#e9ecef","#dee2e6","#f0f4ff","#fff3cd","#d1ecf1","#f8d7da","inherit"] },
  { k: "background-size",       cat: "Color",     hint: "cover / contain / 100%",     values: ["auto","cover","contain","100%","100% 100%","50%"] },
  { k: "opacity",               cat: "Color",     hint: "0.8 / 1 / 0",               values: ["0","0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.8","0.9","1"] },

  { k: "display",               cat: "Layout",    hint: "flex / grid / block / none", values: ["block","inline","inline-block","flex","inline-flex","grid","inline-grid","none","contents","table","table-cell","list-item"] },
  { k: "position",              cat: "Layout",    hint: "relative / absolute / fixed", values: ["static","relative","absolute","fixed","sticky"] },
  { k: "top",                   cat: "Layout",    hint: "0 / 20px / auto",            values: ["0","auto","50%","100%","8px","16px","24px","32px","-8px","-16px"] },
  { k: "right",                 cat: "Layout",    hint: "0 / 20px / auto",            values: ["0","auto","50%","100%","8px","16px","24px","32px"] },
  { k: "bottom",                cat: "Layout",    hint: "0 / 20px / auto",            values: ["0","auto","50%","100%","8px","16px","24px","32px"] },
  { k: "left",                  cat: "Layout",    hint: "0 / 20px / auto",            values: ["0","auto","50%","100%","8px","16px","24px","32px"] },
  { k: "z-index",               cat: "Layout",    hint: "1 / 10 / 999",               values: ["-1","0","1","2","5","10","50","100","999","9999"] },
  { k: "overflow",              cat: "Layout",    hint: "hidden / auto / scroll",     values: ["visible","hidden","scroll","auto","clip"] },
  { k: "overflow-x",            cat: "Layout",    hint: "hidden / auto / scroll",     values: ["visible","hidden","scroll","auto"] },
  { k: "overflow-y",            cat: "Layout",    hint: "hidden / auto / scroll",     values: ["visible","hidden","scroll","auto"] },
  { k: "visibility",            cat: "Layout",    hint: "hidden / visible",           values: ["visible","hidden","collapse"] },

  { k: "flex",                  cat: "Flexbox",   hint: "1 / 0 1 auto / none",        values: ["0","1","auto","none","0 0 auto","0 1 auto","1 1 auto","1 1 0","2"] },
  { k: "flex-direction",        cat: "Flexbox",   hint: "row / column",               values: ["row","column","row-reverse","column-reverse"] },
  { k: "flex-wrap",             cat: "Flexbox",   hint: "wrap / nowrap",              values: ["nowrap","wrap","wrap-reverse"] },
  { k: "justify-content",       cat: "Flexbox",   hint: "center / space-between",     values: ["flex-start","flex-end","center","space-between","space-around","space-evenly","start","end"] },
  { k: "align-items",           cat: "Flexbox",   hint: "center / flex-start",        values: ["flex-start","flex-end","center","baseline","stretch"] },
  { k: "align-self",            cat: "Flexbox",   hint: "center / flex-end / auto",   values: ["auto","flex-start","flex-end","center","baseline","stretch"] },
  { k: "gap",                   cat: "Flexbox",   hint: "8px / 1rem / 10px 20px",     values: ["0","4px","8px","12px","16px","20px","24px","32px","0.5rem","1rem","1.5rem","2rem"] },

  { k: "grid-template-columns", cat: "Grid",      hint: "1fr 1fr / repeat(3,1fr)",    values: ["1fr","1fr 1fr","1fr 1fr 1fr","repeat(2,1fr)","repeat(3,1fr)","repeat(4,1fr)","200px 1fr","auto 1fr","minmax(200px,1fr)","repeat(auto-fill,minmax(200px,1fr))"] },
  { k: "grid-template-rows",    cat: "Grid",      hint: "auto 1fr auto",              values: ["auto","1fr","auto 1fr auto","repeat(3,auto)","minmax(100px,auto)"] },
  { k: "grid-column",           cat: "Grid",      hint: "1 / 3 / span 2",            values: ["auto","1","2","3","span 2","span 3","1 / 3","1 / -1","1 / span 2"] },
  { k: "grid-row",              cat: "Grid",      hint: "1 / 3 / span 2",            values: ["auto","1","2","span 2","1 / 3","1 / -1"] },

  { k: "margin",                cat: "Spacing",   hint: "0 / auto / 16px",            values: ["0","auto","4px","8px","12px","16px","24px","32px","48px","0 auto","0 16px","16px auto","0.5rem","1rem","1.5rem","2rem"] },
  { k: "margin-top",            cat: "Spacing",   hint: "0 / 16px / auto",            values: ["0","auto","4px","8px","16px","24px","32px","48px","1rem","2rem","-8px","-16px"] },
  { k: "margin-bottom",         cat: "Spacing",   hint: "0 / 16px / auto",            values: ["0","auto","4px","8px","16px","24px","32px","48px","1rem","2rem"] },
  { k: "margin-left",           cat: "Spacing",   hint: "0 / 16px / auto",            values: ["0","auto","4px","8px","16px","24px","1rem"] },
  { k: "margin-right",          cat: "Spacing",   hint: "0 / 16px / auto",            values: ["0","auto","4px","8px","16px","24px","1rem"] },
  { k: "padding",               cat: "Spacing",   hint: "0 / 16px / 8px 16px",        values: ["0","4px","8px","12px","16px","20px","24px","32px","48px","8px 16px","12px 24px","16px 32px","0.5rem","1rem","1.5rem","2rem"] },
  { k: "padding-top",           cat: "Spacing",   hint: "0 / 16px",                   values: ["0","4px","8px","16px","24px","32px","48px","1rem","2rem"] },
  { k: "padding-bottom",        cat: "Spacing",   hint: "0 / 16px",                   values: ["0","4px","8px","16px","24px","32px","48px","1rem","2rem"] },
  { k: "padding-left",          cat: "Spacing",   hint: "0 / 16px",                   values: ["0","4px","8px","16px","24px","32px","1rem"] },
  { k: "padding-right",         cat: "Spacing",   hint: "0 / 16px",                   values: ["0","4px","8px","16px","24px","32px","1rem"] },

  { k: "width",                 cat: "Size",      hint: "100% / 200px / auto",         values: ["auto","100%","50%","25%","75%","fit-content","min-content","max-content","100vw","200px","300px","400px","500px","600px","800px","1fr"] },
  { k: "height",                cat: "Size",      hint: "100% / 200px / auto",         values: ["auto","100%","50%","fit-content","min-content","100vh","50vh","200px","300px","400px","500px"] },
  { k: "min-width",             cat: "Size",      hint: "0 / 200px",                   values: ["0","100px","200px","300px","min-content","max-content","fit-content"] },
  { k: "max-width",             cat: "Size",      hint: "100% / 800px / none",         values: ["none","100%","600px","800px","1024px","1200px","1440px","65ch","80ch"] },
  { k: "min-height",            cat: "Size",      hint: "0 / 100px",                   values: ["0","100px","200px","50vh","100vh","fit-content"] },
  { k: "max-height",            cat: "Size",      hint: "none / 400px",                values: ["none","100%","200px","400px","600px","100vh","50vh"] },
  { k: "box-sizing",            cat: "Size",      hint: "border-box / content-box",    values: ["content-box","border-box"] },

  { k: "border",                cat: "Border",    hint: "1px solid #ccc / none",       values: ["none","1px solid #cccccc","1px solid #dddddd","2px solid #333333","1px dashed #cccccc","1px dotted #cccccc","2px solid #e85d04","3px solid #3b82f6","1px solid transparent"] },
  { k: "border-top",            cat: "Border",    hint: "1px solid #ccc",              values: ["none","1px solid #cccccc","2px solid #333333","1px dashed #cccccc","3px solid #e85d04"] },
  { k: "border-bottom",         cat: "Border",    hint: "1px solid #ccc",              values: ["none","1px solid #cccccc","2px solid #333333","1px dashed #cccccc","3px solid #e85d04"] },
  { k: "border-left",           cat: "Border",    hint: "4px solid #e85d04",           values: ["none","1px solid #cccccc","2px solid #333333","4px solid #e85d04","4px solid #3b82f6","6px solid #22c55e"] },
  { k: "border-right",          cat: "Border",    hint: "1px solid #ccc",              values: ["none","1px solid #cccccc","2px solid #333333","4px solid #e85d04"] },
  { k: "border-radius",         cat: "Border",    hint: "4px / 50% / 8px 16px",        values: ["0","2px","4px","6px","8px","12px","16px","20px","24px","50%","100%","4px 8px","0 8px 8px 0","999px"] },
  { k: "border-style",          cat: "Border",    hint: "solid / dashed / dotted",     values: ["none","solid","dashed","dotted","double","groove","ridge","inset","outset"] },
  { k: "border-color",          cat: "Border",    hint: "#ccc / transparent",          values: ["transparent","#cccccc","#dddddd","#333333","#e85d04","#3b82f6","#22c55e","currentColor","inherit"] },
  { k: "outline",               cat: "Border",    hint: "2px solid #0066ff / none",    values: ["none","1px solid #cccccc","2px solid #3b82f6","2px dashed #e85d04","2px solid transparent","3px solid #22c55e"] },
  { k: "outline-offset",        cat: "Border",    hint: "2px / 4px",                   values: ["0","2px","4px","6px","8px","-2px"] },

  { k: "box-shadow",            cat: "Effects",   hint: "0 4px 16px rgba(0,0,0,0.1)", values: ["none","0 1px 3px rgba(0,0,0,0.1)","0 2px 8px rgba(0,0,0,0.15)","0 4px 16px rgba(0,0,0,0.1)","0 8px 32px rgba(0,0,0,0.12)","0 16px 48px rgba(0,0,0,0.15)","inset 0 1px 3px rgba(0,0,0,0.2)","0 0 0 3px rgba(59,130,246,0.3)","0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.1)"] },
  { k: "filter",                cat: "Effects",   hint: "blur(4px) / brightness(1.2)", values: ["none","blur(2px)","blur(4px)","blur(8px)","brightness(0.8)","brightness(1.2)","contrast(1.2)","grayscale(100%)","sepia(100%)","hue-rotate(90deg)","drop-shadow(2px 2px 4px rgba(0,0,0,0.3))"] },
  { k: "backdrop-filter",       cat: "Effects",   hint: "blur(8px)",                  values: ["none","blur(4px)","blur(8px)","blur(16px)","blur(8px) saturate(180%)","saturate(180%) blur(8px)"] },
  { k: "transform",             cat: "Effects",   hint: "scale(1.1) / rotate(45deg)", values: ["none","scale(1.05)","scale(1.1)","scale(0.95)","rotate(45deg)","rotate(-45deg)","translateX(10px)","translateY(-10px)","translate(-50%,-50%)","skewX(5deg)","perspective(500px) rotateY(15deg)"] },
  { k: "transition",            cat: "Effects",   hint: "all 0.3s ease",              values: ["none","all 0.15s ease","all 0.3s ease","all 0.5s ease","opacity 0.3s ease","transform 0.3s ease","background-color 0.2s ease","color 0.2s ease, background-color 0.2s ease","all 0.3s cubic-bezier(0.4,0,0.2,1)"] },
  { k: "cursor",                cat: "Effects",   hint: "pointer / default",          values: ["default","pointer","text","move","grab","grabbing","crosshair","not-allowed","zoom-in","zoom-out","none","wait","help"] },
  { k: "pointer-events",        cat: "Effects",   hint: "none / auto",                values: ["auto","none","all"] },

  { k: "list-style",            cat: "List/Table", hint: "none / disc",               values: ["none","disc","circle","square","decimal","decimal-leading-zero","lower-roman","upper-roman","lower-alpha","upper-alpha"] },
  { k: "border-collapse",       cat: "List/Table", hint: "collapse / separate",       values: ["collapse","separate"] },
  { k: "vertical-align",        cat: "List/Table", hint: "middle / top / bottom",     values: ["baseline","top","middle","bottom","text-top","text-bottom","sub","super"] },
];

const CAT_COLORS = {
  Typography:  "#7aa2f7",
  Color:       "#f87171",
  Layout:      "#c084fc",
  Flexbox:     "#34d399",
  Grid:        "#fbbf24",
  Spacing:     "#6ee7b7",
  Size:        "#60a5fa",
  Border:      "#fb923c",
  Effects:     "#f472b6",
  "List/Table":"#94a3b8",
};
const ALL_CATS = Object.keys(CAT_COLORS);

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head><title>My Page</title></head>
<body>
  <header>
    <h1>Welcome to My Page</h1>
    <nav>
      <a href="#">Home</a> ·
      <a href="#">About</a> ·
      <a href="#">Contact</a>
    </nav>
  </header>
  <main>
    <h2>Introduction</h2>
    <p>This is a plain HTML page. Drag a <strong>mat</strong> onto any element in the preview to style it.</p>
    <blockquote>Design is not just what it looks like — design is how it works.</blockquote>
    <h2>Features</h2>
    <ul>
      <li>Create named style mats with any CSS properties</li>
      <li>Drag mats onto elements in the live preview</li>
      <li>Multiple mats stack and merge on one element</li>
    </ul>
    <pre><code>function greet(name) {
  return "Hello, " + name;
}</code></pre>
    <table>
      <tr><th>Name</th><th>Role</th></tr>
      <tr><td>Alice</td><td>Designer</td></tr>
      <tr><td>Bob</td><td>Developer</td></tr>
    </table>
  </main>
  <footer><p>Made with Mat Studio</p></footer>
</body>
</html>`;

const STARTER_MATS = [
  { id: "mat-1", name: "Card",      props: [{ k: "background", v: "#ffffff" },{ k: "border-radius", v: "12px" },{ k: "padding", v: "24px" },{ k: "box-shadow", v: "0 4px 24px rgba(0,0,0,0.10)" }] },
  { id: "mat-2", name: "Hero Text", props: [{ k: "font-size", v: "2.6rem" },{ k: "font-weight", v: "800" },{ k: "letter-spacing", v: "-0.03em" },{ k: "line-height", v: "1.1" }] },
  { id: "mat-3", name: "Accent",    props: [{ k: "color", v: "#e85d04" },{ k: "border-left", v: "4px solid #e85d04" },{ k: "padding-left", v: "16px" }] },
];

const BRIDGE_SCRIPT = `
(function(){
  var ms=document.createElement('style');ms.id='__mat_styles__';document.head.appendChild(ms);
  var ui=document.createElement('style');ui.id='__mat_ui__';
  ui.textContent='html,body{background:#ffffff;color:#111111;}.__mat_hover__{outline:2px dashed #f59e0b!important;outline-offset:3px!important;cursor:crosshair!important;}.__mat_flash__{outline:3px solid #22c55e!important;outline-offset:3px!important;}.__mat_selected__{outline:2px solid #3b82f6!important;outline-offset:3px!important;}';
  document.head.appendChild(ui);
  var matCSS={};
  function rebuild(){ms.textContent=Object.entries(matCSS).map(function(e){return'.'+e[0]+'{'+e[1]+'}'}).join('\\n');}
  var hov=null,SKIP=['HTML','HEAD','STYLE','SCRIPT','LINK','META','TITLE'];
  document.addEventListener('dragover',function(e){
    e.preventDefault();var el=document.elementFromPoint(e.clientX,e.clientY);
    if(!el||SKIP.includes(el.tagName))return;
    if(el!==hov){if(hov)hov.classList.remove('__mat_hover__');el.classList.add('__mat_hover__');hov=el;window.parent.postMessage({type:'HOVER_TAG',tag:el.tagName.toLowerCase()},'*');}
  });
  document.addEventListener('dragleave',function(e){
    if(!e.relatedTarget||e.relatedTarget===document.documentElement){if(hov){hov.classList.remove('__mat_hover__');hov=null;}window.parent.postMessage({type:'HOVER_TAG',tag:null},'*');}
  });
  document.addEventListener('drop',function(e){
    e.preventDefault();
    var id=e.dataTransfer.getData('matId'),name=e.dataTransfer.getData('matName'),pj=e.dataTransfer.getData('matProps');
    if(!id||!hov)return;
    var t=hov;hov=null;t.classList.remove('__mat_hover__');
    var cn='mat--'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),np;
    try{np=JSON.parse(pj);}catch(err){return;}
    var m={};(matCSS[cn]||'').split(';').forEach(function(r){var i=r.indexOf(':');if(i<0)return;var k=r.slice(0,i).trim(),v=r.slice(i+1).trim();if(k)m[k]=v;});
    np.forEach(function(p){if(p.k)m[p.k.trim()]=p.v.trim();});
    matCSS[cn]=Object.entries(m).map(function(e){return e[0]+':'+e[1]}).join(';');
    t.classList.add(cn);rebuild();
    t.classList.add('__mat_flash__');setTimeout(function(){t.classList.remove('__mat_flash__');},600);
    window.parent.postMessage({type:'DROP_DONE'},'*');
  });
  var sel=null;
  document.addEventListener('click',function(e){
    if(e.defaultPrevented)return;
    var el=e.target;
    if(SKIP.includes(el.tagName))return;
    if(sel){sel.classList.remove('__mat_selected__');}
    var mats=Array.from(el.classList).filter(function(c){return c.startsWith('mat--');});
    if(mats.length>0){
      sel=el;el.classList.add('__mat_selected__');
      var r=el.getBoundingClientRect();
      window.parent.postMessage({type:'INSPECT',mats:mats,tag:el.tagName.toLowerCase(),rect:{top:r.top,left:r.left,width:r.width}},'*');
    } else {
      sel=null;
      window.parent.postMessage({type:'INSPECT_CLEAR'},'*');
    }
  });
  window.addEventListener('message',function(e){
    if(!e.data)return;
    if(e.data.type==='REMOVE_MAT'){
      var cn=e.data.className;
      // Only remove from the currently selected element, not all elements
      if(sel){
        sel.classList.remove(cn);
        var mats=Array.from(sel.classList).filter(function(c){return c.startsWith('mat--');});
        if(mats.length>0){
          var r=sel.getBoundingClientRect();
          window.parent.postMessage({type:'INSPECT',mats:mats,tag:sel.tagName.toLowerCase(),rect:{top:r.top,left:r.left,width:r.width}},'*');
        } else {
          sel.classList.remove('__mat_selected__');sel=null;
          window.parent.postMessage({type:'INSPECT_CLEAR'},'*');
        }
      }
    }
    if(e.data.type==='GET_HTML'){
      document.querySelectorAll('.__mat_hover__,.__mat_flash__,.__mat_selected__').forEach(function(el){el.classList.remove('__mat_hover__','__mat_flash__','__mat_selected__');});
      window.parent.postMessage({type:'EXPORT_HTML',html:document.documentElement.outerHTML},'*');
    }
  });
})();`;

function uid() { return "mat-" + Math.random().toString(36).slice(2,9); }
const PALETTE = ["#f59e0b","#22c55e","#3b82f6","#e85d04","#a855f7","#ec4899","#14b8a6","#ef4444"];
function matColor(id) { let n=0; for(let i=0;i<id.length;i++) n+=id.charCodeAt(i); return PALETTE[n%PALETTE.length]; }

// ── Shared picker modal (used for both key and value) ─────────────────────────
function Picker({ mode, propKey, onSelect, onClose }) {
  const [query, setQuery]       = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  // For value mode: get suggested values from the matching CSS_DB entry
  const valueList = useMemo(() => {
    if (mode !== "value") return [];
    const entry = CSS_DB.find(e => e.k === propKey);
    return entry ? entry.values : [];
  }, [mode, propKey]);

  // For key mode: filter the full DB
  const keyResults = useMemo(() => {
    if (mode !== "key") return [];
    const q = query.toLowerCase().trim();
    return CSS_DB.filter(item => {
      const matchCat = activeCat === "All" || item.cat === activeCat;
      const matchQ   = !q || item.k.includes(q) || item.cat.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [mode, query, activeCat]);

  const keyGrouped = useMemo(() => {
    const map = {};
    keyResults.forEach(item => { if (!map[item.cat]) map[item.cat]=[]; map[item.cat].push(item); });
    return map;
  }, [keyResults]);

  // For value mode: filter suggestions
  const filteredValues = useMemo(() => {
    if (mode !== "value") return [];
    const q = query.toLowerCase().trim();
    return q ? valueList.filter(v => v.toLowerCase().includes(q)) : valueList;
  }, [mode, query, valueList]);

  const firstResult = mode === "key" ? keyResults[0]?.k : filteredValues[0];

  return (
    <div style={{
      position:"fixed",inset:0,zIndex:9999,
      display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(0,0,0,0.55)",backdropFilter:"blur(6px)",
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        width: mode==="value" ? 420 : 540,
        maxHeight:"70vh",
        background:"#1e2030",
        border:"1px solid #3a3a5a",
        borderRadius:"14px",overflow:"hidden",
        display:"flex",flexDirection:"column",
        boxShadow:"0 32px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Search */}
        <div style={{
          padding:"13px 16px",borderBottom:"1px solid #2e2e4a",
          display:"flex",alignItems:"center",gap:"10px",
          background:"#181926",
        }}>
          <span style={{color:"#888",fontSize:"15px"}}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder={mode==="key" ? "Search CSS properties…" : `Search values for ${propKey}…`}
            style={{
              flex:1,background:"transparent",border:"none",outline:"none",
              color:"#e0e4f4",fontSize:"13px",fontFamily:"monospace",
              caretColor:"#e85d04",
            }}
            onKeyDown={e=>{
              if(e.key==="Escape") onClose();
              if(e.key==="Enter" && firstResult) onSelect(firstResult);
            }}
          />
          <span style={{fontSize:"10px",color:"#555",fontFamily:"monospace"}}>
            {mode==="key" ? `${keyResults.length} props` : `${filteredValues.length} vals`}
          </span>
          <button onClick={onClose} style={{
            background:"transparent",border:"none",color:"#555",
            cursor:"pointer",fontSize:"17px",lineHeight:1,
          }}>×</button>
        </div>

        {/* Category pills — key mode only */}
        {mode==="key" && (
          <div style={{
            display:"flex",gap:"5px",padding:"9px 14px",
            borderBottom:"1px solid #2e2e4a",overflowX:"auto",flexShrink:0,
            background:"#181926",
          }}>
            {["All",...ALL_CATS].map(cat=>{
              const active=activeCat===cat;
              const col=cat==="All"?"#e85d04":CAT_COLORS[cat];
              return (
                <button key={cat} onClick={()=>setActiveCat(cat)} style={{
                  background:active?col+"33":"transparent",
                  border:`1px solid ${active?col:"#2e2e4a"}`,
                  color:active?col:"#666",
                  padding:"3px 10px",borderRadius:"20px",cursor:"pointer",
                  fontSize:"10px",fontFamily:"monospace",letterSpacing:"0.03em",
                  whiteSpace:"nowrap",transition:"all 0.15s",flexShrink:0,
                }}>{cat}</button>
              );
            })}
          </div>
        )}

        {/* Results */}
        <div style={{overflow:"auto",flex:1}}>
          {mode==="key" ? (
            <>
              {Object.entries(keyGrouped).map(([cat,items])=>(
                <div key={cat}>
                  <div style={{
                    padding:"7px 16px 3px",fontSize:"9px",letterSpacing:"0.12em",
                    color:CAT_COLORS[cat]+"99",fontFamily:"monospace",
                    position:"sticky",top:0,background:"#1e2030",zIndex:1,
                  }}>{cat.toUpperCase()}</div>
                  {items.map(item=>(
                    <div key={item.k} onClick={()=>onSelect(item.k)}
                      style={{
                        display:"flex",alignItems:"center",gap:"10px",
                        padding:"7px 16px",cursor:"pointer",transition:"background 0.1s",
                      }}
                      onMouseEnter={e=>e.currentTarget.style.background="#252740"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >
                      <span style={{width:6,height:6,borderRadius:"50%",flexShrink:0,background:CAT_COLORS[cat]}} />
                      <span style={{fontSize:"12px",fontFamily:"monospace",color:"#b0bce8",flex:1}}>
                        {query
                          ? item.k.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`, "i")).map((p,i)=>
                              p.toLowerCase()===query.toLowerCase()
                                ? <span key={i} style={{color:"#f59e0b",fontWeight:700}}>{p}</span> : p)
                          : item.k}
                      </span>
                      <span style={{fontSize:"10px",fontFamily:"monospace",color:"#444",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.hint}</span>
                      <span style={{fontSize:"9px",color:CAT_COLORS[cat]+"77",border:`1px solid ${CAT_COLORS[cat]}33`,padding:"1px 5px",borderRadius:"3px",fontFamily:"monospace",flexShrink:0}}>{cat}</span>
                    </div>
                  ))}
                </div>
              ))}
              {keyResults.length===0 && <div style={{padding:"32px",textAlign:"center",color:"#444",fontSize:"12px",fontFamily:"monospace"}}>no properties found</div>}
            </>
          ) : (
            /* Value picker */
            <div style={{padding:"8px 10px"}}>
              {filteredValues.length===0 && query && (
                <div style={{padding:"10px 6px",color:"#555",fontSize:"11px",fontFamily:"monospace"}}>
                  no suggestions — press ↵ to use "{query}"
                </div>
              )}
              {filteredValues.map((v,i)=>(
                <div key={i} onClick={()=>onSelect(v)}
                  style={{
                    display:"flex",alignItems:"center",gap:"8px",
                    padding:"7px 10px",borderRadius:"6px",cursor:"pointer",
                    transition:"background 0.1s",marginBottom:"1px",
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background="#252740"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  {/* Color swatch if value looks like a color */}
                  {/^#[0-9a-f]{3,8}$|^rgb|^hsl|^rgba/i.test(v) && (
                    <div style={{width:14,height:14,borderRadius:"3px",background:v,border:"1px solid #3a3a5a",flexShrink:0}} />
                  )}
                  <span style={{
                    fontSize:"12px",fontFamily:"monospace",color:"#e5c07b",flex:1,
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                  }}>
                    {query
                      ? v.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`, "i")).map((p,j)=>
                          p.toLowerCase()===query.toLowerCase()
                            ? <span key={j} style={{color:"#f59e0b",fontWeight:700}}>{p}</span> : p)
                      : v}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding:"8px 16px",borderTop:"1px solid #2e2e4a",
          display:"flex",gap:"16px",flexShrink:0,background:"#181926",
        }}>
          {[["↵","select / confirm"],["esc","close"],["click","pick"]].map(([key,desc])=>(
            <div key={key} style={{display:"flex",gap:"5px",alignItems:"center"}}>
              <span style={{fontSize:"9px",color:"#666",background:"#12131f",border:"1px solid #2a2a40",padding:"1px 5px",borderRadius:"3px",fontFamily:"monospace"}}>{key}</span>
              <span style={{fontSize:"9px",color:"#444",fontFamily:"monospace"}}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PropRow ───────────────────────────────────────────────────────────────────
function PropRow({ prop, index, onUpdate, onDelete }) {
  const [picker, setPicker] = useState(null); // null | "key" | "value"

  return (
    <>
      {picker && (
        <Picker
          mode={picker}
          propKey={prop.k}
          onSelect={val => { onUpdate(index, picker==="key"?"k":"v", val); setPicker(null); }}
          onClose={() => setPicker(null)}
        />
      )}
      <div style={{display:"flex",gap:"6px",marginBottom:"6px",alignItems:"center"}}>

        {/* KEY input + picker btn */}
        <div style={{flex:1,display:"flex",minWidth:0}}>
          <input
            value={prop.k}
            onChange={e=>onUpdate(index,"k",e.target.value)}
            placeholder="property"
            style={{
              flex:1,background:"#12131f",border:"1px solid #2e2e4a",borderRight:"none",
              color:"#7aa2f7",padding:"6px 8px",borderRadius:"6px 0 0 6px",
              fontSize:"12px",fontFamily:"monospace",outline:"none",minWidth:0,
            }}
          />
          <button onClick={()=>setPicker("key")} title="Browse CSS properties"
            style={{
              background:"#1a1b2e",border:"1px solid #2e2e4a",borderLeft:"1px solid #3a3a5a",
              color:"#555",cursor:"pointer",padding:"0 8px",borderRadius:"0 6px 6px 0",
              fontSize:"12px",transition:"all 0.15s",flexShrink:0,
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="#252740";e.currentTarget.style.color="#e85d04";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#1a1b2e";e.currentTarget.style.color="#555";}}
          >⌕</button>
        </div>

        <span style={{color:"#444",fontSize:"12px",flexShrink:0}}>:</span>

        {/* VALUE input + picker btn */}
        <div style={{flex:1,display:"flex",minWidth:0}}>
          <input
            value={prop.v}
            onChange={e=>onUpdate(index,"v",e.target.value)}
            placeholder="value"
            style={{
              flex:1,background:"#12131f",border:"1px solid #2e2e4a",borderRight:"none",
              color:"#e5c07b",padding:"6px 8px",borderRadius:"6px 0 0 6px",
              fontSize:"12px",fontFamily:"monospace",outline:"none",minWidth:0,
            }}
          />
          <button onClick={()=>prop.k && setPicker("value")} title="Browse values for this property"
            style={{
              background:"#1a1b2e",border:"1px solid #2e2e4a",borderLeft:"1px solid #3a3a5a",
              color: prop.k ? "#555" : "#2a2a3a",
              cursor: prop.k ? "pointer" : "not-allowed",
              padding:"0 8px",borderRadius:"0 6px 6px 0",
              fontSize:"12px",transition:"all 0.15s",flexShrink:0,
            }}
            onMouseEnter={e=>{if(prop.k){e.currentTarget.style.background="#252740";e.currentTarget.style.color="#f59e0b";}}}
            onMouseLeave={e=>{e.currentTarget.style.background="#1a1b2e";e.currentTarget.style.color=prop.k?"#555":"#2a2a3a";}}
          >⌕</button>
        </div>

        <button onClick={()=>onDelete(index)} style={{
          background:"transparent",border:"none",color:"#444",
          cursor:"pointer",fontSize:"14px",padding:"2px 4px",flexShrink:0,
          transition:"color 0.15s",
        }}
          onMouseEnter={e=>e.target.style.color="#ef4444"}
          onMouseLeave={e=>e.target.style.color="#444"}
        >×</button>
      </div>
    </>
  );
}

// ── MatCard ───────────────────────────────────────────────────────────────────
function MatCard({ mat, onUpdate, onDelete, onDragStart }) {
  const [open, setOpen] = useState(false);
  const color = matColor(mat.id);
  const addProp = () => onUpdate({...mat, props:[...mat.props,{k:"",v:""}]});
  const updProp = (i,f,v) => onUpdate({...mat, props:mat.props.map((p,j)=>j===i?{...p,[f]:v}:p)});
  const delProp = (i) => onUpdate({...mat, props:mat.props.filter((_,j)=>j!==i)});

  return (
    <div
      draggable={!open}
      onDragStart={e=>!open&&onDragStart(e,mat)}
      style={{
        background:"#181926",
        border:`1px solid ${open?color+"66":"#2a2a40"}`,
        borderRadius:"10px",marginBottom:"8px",
        cursor:open?"default":"grab",
        transition:"border-color 0.15s, box-shadow 0.15s",
        boxShadow:open?`0 0 20px ${color}22`:"none",
        userSelect:"none",
      }}
    >
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 12px"}}>
        <div style={{width:10,height:10,borderRadius:"50%",flexShrink:0,background:color,boxShadow:`0 0 8px ${color}99`}} />
        {open
          ? <input value={mat.name} onChange={e=>onUpdate({...mat,name:e.target.value})}
              onClick={e=>e.stopPropagation()}
              style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#e8eaf6",fontSize:"13px",fontFamily:"monospace",fontWeight:700}}
            />
          : <span style={{flex:1,fontSize:"13px",fontWeight:700,color:"#c8cce8",fontFamily:"monospace"}}>{mat.name}</span>
        }
        <span style={{fontSize:"9px",color:"#444",fontFamily:"monospace"}}>{mat.props.length}p</span>
        <button onClick={e=>{e.stopPropagation();setOpen(!open);}} style={{
          background:open?color+"33":"#12131f",border:`1px solid ${open?color+"66":"#2a2a40"}`,
          color:open?color:"#888",cursor:"pointer",
          padding:"3px 10px",borderRadius:"5px",fontSize:"11px",fontFamily:"monospace",
          transition:"all 0.15s",
        }}>{open?"done":"edit"}</button>
        <button onClick={e=>{e.stopPropagation();onDelete(mat.id);}} style={{
          background:"transparent",border:"none",color:"#444",cursor:"pointer",
          padding:"1px 5px",fontSize:"14px",transition:"color 0.15s",
        }}
          onMouseEnter={e=>e.target.style.color="#ef4444"}
          onMouseLeave={e=>e.target.style.color="#444"}
        >×</button>
      </div>

      {/* Editor */}
      {open && (
        <div style={{padding:"0 12px 12px",borderTop:"1px solid #22223a"}}>
          <div style={{paddingTop:"10px"}}>
            {mat.props.map((p,i)=>(
              <PropRow key={i} prop={p} index={i} onUpdate={updProp} onDelete={delProp} />
            ))}
            <button onClick={addProp} style={{
              width:"100%",marginTop:"4px",
              background:"transparent",border:`1px dashed ${color}55`,
              color:color,padding:"7px",borderRadius:"6px",
              cursor:"pointer",fontSize:"11px",fontFamily:"monospace",
              transition:"background 0.15s",
            }}
              onMouseEnter={e=>e.target.style.background=color+"18"}
              onMouseLeave={e=>e.target.style.background="transparent"}
            >+ add property</button>
          </div>
        </div>
      )}

      {/* Collapsed preview */}
      {!open && mat.props.length>0 && (
        <div style={{padding:"2px 12px 10px 30px"}}>
          {mat.props.slice(0,3).map((p,i)=>(
            <div key={i} style={{fontSize:"11px",fontFamily:"monospace",lineHeight:1.8}}>
              <span style={{color:"#5a6080"}}>{p.k||"…"}</span>
              <span style={{color:"#333"}}>{": "}</span>
              <span style={{color:"#6a8060"}}>{p.v||"…"}</span>
            </div>
          ))}
          {mat.props.length>3 && <div style={{fontSize:"10px",color:"#3a3a50",fontFamily:"monospace"}}>+{mat.props.length-3} more</div>}
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [html, setHtml]           = useState(DEFAULT_HTML);
  const [mats, setMats]           = useState(STARTER_MATS);
  const [tab, setTab]             = useState("mats");
  const [hoverTag, setHoverTag]   = useState(null);
  const [dropFlash, setDropFlash] = useState(false);
  const [inspect, setInspect]         = useState(null); // {mats, tag, rect}
  const iframeRef      = useRef(null);
  const exportResolveRef = useRef(null);

  const buildPreview = useCallback(()=>{
    const iframe=iframeRef.current;if(!iframe)return;
    const doc=iframe.contentDocument;if(!doc)return;
    const bridged=html.includes("</body>")
      ?html.replace("</body>",`<script>${BRIDGE_SCRIPT}<\/script></body>`)
      :html+`<script>${BRIDGE_SCRIPT}<\/script>`;
    doc.open();doc.write(bridged);doc.close();
  },[html]);
  useEffect(()=>{buildPreview();},[buildPreview]);

  useEffect(()=>{
    const h=e=>{
      if(!e.data)return;
      if(e.data.type==="HOVER_TAG")setHoverTag(e.data.tag);
      if(e.data.type==="DROP_DONE"){setDropFlash(true);setHoverTag(null);setTimeout(()=>setDropFlash(false),900);}
      if(e.data.type==="INSPECT"){setInspect({mats:e.data.mats,tag:e.data.tag,rect:e.data.rect});}
      if(e.data.type==="INSPECT_CLEAR"){setInspect(null);}
      if(e.data.type==="EXPORT_HTML"&&exportResolveRef.current){exportResolveRef.current(e.data.html);exportResolveRef.current=null;}
    };
    window.addEventListener("message",h);return()=>window.removeEventListener("message",h);
  },[]);

  const removeMat = (className) => {
    iframeRef.current?.contentWindow?.postMessage({type:"REMOVE_MAT", className}, "*");
  };

  const handleExport=async()=>{
    const out=await new Promise(res=>{
      exportResolveRef.current=res;
      iframeRef.current?.contentWindow?.postMessage({type:"GET_HTML"},"*");
      setTimeout(()=>{if(exportResolveRef.current){res(null);exportResolveRef.current=null;}},1500);
    });
    const blob=new Blob([out||html],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="beautified.html";a.click();
    URL.revokeObjectURL(url);
  };

  const handleDragStart=(e,mat)=>{
    e.dataTransfer.setData("matId",mat.id);
    e.dataTransfer.setData("matName",mat.name);
    e.dataTransfer.setData("matProps",JSON.stringify(mat.props));
    e.dataTransfer.effectAllowed="copy";
  };

  // ── Shared style tokens ──
  const T={
    bg0:"#0f1018", bg1:"#13141f", bg2:"#181926", bg3:"#1e2030",
    border:"#2a2a40", borderLight:"#3a3a5a",
    text:"#c8cce8", textDim:"#888", textFaint:"#555",
    accent:"#e85d04", accentB:"#f59e0b",
  };

  return (
    <div style={{
      display:"flex",flexDirection:"column",height:"100vh",
      background:T.bg0,color:T.text,
      fontFamily:"'DM Mono','Courier New',monospace",overflow:"hidden",
    }}>
      {/* ── Top Bar ── */}
      <div style={{
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 18px",height:"52px",
        background:T.bg1,borderBottom:`1px solid ${T.border}`,flexShrink:0,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{
            width:28,height:28,borderRadius:"7px",
            background:`linear-gradient(135deg,${T.accent},${T.accentB})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"15px",boxShadow:`0 0 16px ${T.accent}55`,
          }}>◈</div>
          <span style={{fontSize:"13px",fontWeight:700,letterSpacing:"0.08em",color:"#eef0ff"}}>MAT STUDIO</span>
        </div>

        <div style={{
          fontSize:"11px",letterSpacing:"0.04em",fontFamily:"monospace",
          color:dropFlash?"#4ade80":hoverTag?"#fbbf24":T.textFaint,
          transition:"color 0.25s",
        }}>
          {dropFlash?"✓ mat applied":hoverTag?`hovering <${hoverTag}>`:"drag a mat → drop on any element"}
        </div>

        <div style={{display:"flex",gap:"7px",alignItems:"center"}}>
          <button onClick={handleExport} style={{
            background:`linear-gradient(135deg,${T.accent},${T.accentB})`,
            border:"none",color:"#fff",padding:"7px 18px",borderRadius:"7px",
            cursor:"pointer",fontSize:"11px",fontFamily:"inherit",
            fontWeight:700,letterSpacing:"0.06em",
            boxShadow:`0 0 16px ${T.accent}55`,
          }}>⬇ EXPORT</button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* ── Left Panel ── */}
        <div style={{
          width:"300px",flexShrink:0,background:T.bg1,
          borderRight:`1px solid ${T.border}`,
          display:"flex",flexDirection:"column",overflow:"hidden",
        }}>
          <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
            {[["mats","◈ MATS"],["code","{ } CODE"]].map(([t,label])=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                flex:1,padding:"11px",background:"transparent",border:"none",
                borderBottom:tab===t?`2px solid ${T.accent}`:"2px solid transparent",
                color:tab===t?T.accentB:T.textFaint,
                cursor:"pointer",fontSize:"10px",fontFamily:"inherit",
                letterSpacing:"0.08em",transition:"all 0.15s",
              }}>{label}</button>
            ))}
          </div>

          {tab==="mats" ? (
            <div style={{flex:1,overflow:"auto",padding:"14px"}}>
              <div style={{
                background:T.bg3,border:`1px solid ${T.border}`,
                borderRadius:"8px",padding:"10px 13px",marginBottom:"14px",
              }}>
                <div style={{fontSize:"9px",color:T.textFaint,letterSpacing:"0.1em",marginBottom:"6px"}}>HOW TO USE</div>
                <div style={{fontSize:"11px",color:T.textDim,lineHeight:2}}>
                  1. Hit <span style={{color:T.accent}}>edit</span> → add props<br/>
                  2. <span style={{color:T.accentB}}>⌕</span> picks keys <em>and</em> values<br/>
                  3. Drag card → drop on preview<br/>
                  4. Click element → remove any mat
                </div>
              </div>

              {mats.map(mat=>(
                <MatCard key={mat.id} mat={mat}
                  onUpdate={u=>setMats(p=>p.map(m=>m.id===u.id?u:m))}
                  onDelete={id=>setMats(p=>p.filter(m=>m.id!==id))}
                  onDragStart={handleDragStart}
                />
              ))}

              <button
                onClick={()=>{setMats(p=>[...p,{id:uid(),name:"New Mat",props:[{k:"",v:""}]}]);}}
                style={{
                  width:"100%",padding:"10px",
                  background:"transparent",border:`1px dashed ${T.border}`,
                  color:T.textFaint,borderRadius:"9px",cursor:"pointer",
                  fontSize:"11px",fontFamily:"inherit",letterSpacing:"0.04em",
                  transition:"all 0.2s",
                }}
                onMouseEnter={e=>{e.target.style.borderColor=T.accent;e.target.style.color=T.accent;}}
                onMouseLeave={e=>{e.target.style.borderColor=T.border;e.target.style.color=T.textFaint;}}
              >+ new mat</button>
            </div>
          ) : (
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{
                padding:"7px 14px",background:T.bg0,
                borderBottom:`1px solid ${T.border}`,flexShrink:0,
                display:"flex",justifyContent:"space-between",
              }}>
                <span style={{fontSize:"9px",color:T.textFaint,letterSpacing:"0.1em"}}>INPUT HTML</span>
                <span style={{fontSize:"9px",color:T.textFaint}}>{html.length} chars</span>
              </div>
              <textarea value={html} onChange={e=>setHtml(e.target.value)} spellCheck={false}
                style={{
                  flex:1,background:T.bg0,color:"#7a8ab0",
                  border:"none",outline:"none",padding:"14px",
                  fontFamily:"monospace",fontSize:"12px",lineHeight:1.7,
                  resize:"none",overflow:"auto",tabSize:2,
                }}
              />
            </div>
          )}
        </div>

        {/* ── Preview ── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg0,position:"relative"}}>
          <div style={{
            padding:"8px 16px",background:T.bg1,
            borderBottom:`1px solid ${T.border}`,
            display:"flex",alignItems:"center",gap:"8px",flexShrink:0,
          }}>
            <div style={{display:"flex",gap:"5px"}}>
              {["#ff5f57","#febc2e","#28c840"].map(c=>(
                <div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}} />
              ))}
            </div>
            <div style={{
              flex:1,background:T.bg0,borderRadius:"5px",
              padding:"4px 11px",fontSize:"10px",color:T.textFaint,
              fontFamily:"monospace",border:`1px solid ${T.border}`,
            }}>
              live preview · {mats.length} mat{mats.length!==1?"s":""}
            </div>
            <div style={{
              width:9,height:9,borderRadius:"50%",
              background:dropFlash?"#4ade80":hoverTag?"#fbbf24":T.border,
              boxShadow:dropFlash?"0 0 8px #4ade80":hoverTag?"0 0 8px #fbbf24":"none",
              transition:"all 0.2s",
            }} />
          </div>

          {/* ── Inspect Panel ── */}
          {inspect && inspect.mats.length > 0 && (
            <div style={{
              position:"absolute", bottom:32, right:32, zIndex:100,
              background:T.bg3, border:`1px solid ${T.borderLight}`,
              borderRadius:"10px", padding:"12px 14px", minWidth:220,
              boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
            }}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"}}>
                <div style={{fontSize:"10px",color:T.textFaint,letterSpacing:"0.08em",fontFamily:"monospace"}}>
                  &lt;{inspect.tag}&gt; — applied mats
                </div>
                <button onClick={()=>setInspect(null)} style={{
                  background:"transparent",border:"none",color:T.textFaint,
                  cursor:"pointer",fontSize:"14px",lineHeight:1,padding:"0 2px",
                }}>×</button>
              </div>
              {inspect.mats.map((cn,i)=>{
                const label = cn.replace(/^mat--/,"").replace(/-/g," ");
                const col = PALETTE[i % PALETTE.length];
                return (
                  <div key={cn} style={{
                    display:"flex",alignItems:"center",gap:"8px",
                    padding:"6px 8px",borderRadius:"6px",marginBottom:"4px",
                    background:T.bg2,border:`1px solid ${T.border}`,
                  }}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:col,flexShrink:0,boxShadow:`0 0 6px ${col}88`}} />
                    <span style={{flex:1,fontSize:"12px",fontFamily:"monospace",color:"#c8cce8"}}>{label}</span>
                    <button
                      onClick={()=>removeMat(cn)}
                      title="Remove this mat from element"
                      style={{
                        background:"transparent",border:`1px solid #3a2a2a`,color:"#664444",
                        cursor:"pointer",fontSize:"10px",fontFamily:"monospace",
                        padding:"2px 7px",borderRadius:"4px",transition:"all 0.15s",
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background="#3a1a1a";e.currentTarget.style.color="#ef4444";e.currentTarget.style.borderColor="#ef4444";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#664444";e.currentTarget.style.borderColor="#3a2a2a";}}
                    >remove</button>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{
            flex:1,overflow:"auto",display:"flex",justifyContent:"center",
            padding:"0",background:"#0c0d14",
          }}>

            <div style={{
              width:"100%",height:"100%",
              boxShadow:"0 0 60px rgba(0,0,0,0.8), 0 0 0 1px #2a2a40",
              borderRadius:"5px",overflow:"hidden",
            }}>
              <iframe ref={iframeRef}
                style={{width:"100%",height:"100%",border:"none",display:"block"}}
                title="preview" sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
