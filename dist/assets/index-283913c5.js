(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerpolicy&&(s.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?s.credentials="include":o.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const g=document.getElementById("temperature"),v=document.getElementById("output");v.innerHTML=g.value;g.oninput=function(){v.innerHTML=this.value};const T=document.getElementById("model"),f=["text-davinci-003","code-davinci-002","text-curie-001"];for(let e=0;e<f.length;e++){let t=f[e];const n=document.createElement("option");n.textContent=t,n.value=t,T.appendChild(n)}const E="/assets/bot-2f62ef66.svg",b="/assets/user-bcdeb18e.svg",l=document.querySelector(".chatform"),c=document.getElementById("chatContainer"),I=document.getElementById("temperature"),w=document.getElementById("logout"),C=document.getElementById("deleteAll"),u=document.getElementById("promptList"),d=document.getElementById("model"),M=document.getElementById("overlayContent");document.querySelectorAll("#save");let p=[],y;w.addEventListener("click",()=>{window.location.href="/index.html"});d.addEventListener("change",function(){d.value=this.value});function S(e){e.textContent="",y=setInterval(()=>{e.textContent+=".",e.textContent.length>3&&(e.textContent="")},400)}async function B(e){const t=p.find(r=>r.id===e);(await fetch("http://localhost:3000/prompt/savePrompt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({response:t.response,prompt:t.prompt})})).status===200&&(u.innerHTML+=`<li>Q: ${t.prompt}<br> A: ${t.response}</li>`)}(async function(){const t=await fetch("http://localhost:3000/prompt/savedPrompts",{method:"GET",headers:{"Content-Type":"application/json"}});t.status===200&&(await t.json()).forEach(r=>{u.innerHTML+=`<li>Q: ${r.prompt}<br> A: ${r.response}</li>`})})();C.addEventListener("click",async()=>{(await fetch("http://localhost:3000/prompt/deleteAll",{method:"POST",headers:{"Content-Type":"application/json"}})).status===200&&(u.innerHTML="")});document.addEventListener("click",$);function $(e){if(e.target&&e.target.id=="save"){const n=e.target.closest(".wrapper").querySelector(".message").id;B(n)}}function H(e,t){let n=0,r=setInterval(()=>{n<t.length?(e.innerHTML+=t.charAt(n),n++):clearInterval(r)},20)}function x(){const e=Date.now(),t=Math.floor(Math.random()*1e8);return`id-${e}-${t}`}function h(e,t,n){return`
        <div class="wrapper ${e&&"ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${e?E:b} 
                      alt="${e?"bot":"user"}" 
                    />
                </div>
                <div class="message" id=${n}>${t}</div>
                ${e?'<button><img id="save" src="../assets/heart.svg" alt="save" /></button>':""}
            </div>
        </div>
            `}const L=async e=>{e.preventDefault();const t=new FormData(l);c.innerHTML+=h(!1,t.get("prompt")),l.reset();const n=x();c.innerHTML+=h(!0," ",n),c.scrollTop=c.scrollHeight;const r=document.getElementById(n),o=I.value,s=t.get("prompt");p.length<=0&&M.classList.toggle("hidden"),S(r);const a=await fetch("http://localhost:3000/chatbot",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:d.value,prompt:t.get("prompt"),temperature:o})});if(clearInterval(y),r.innerHTML=" ",a.ok){const i=await a.json(),m=i.bot.trim();H(r,m),console.log(i),p.push({prompt:s,response:m,id:n})}else{const i=await a.text();r.innerHTML="Something went wrong",alert(i)}};l.addEventListener("submit",L);l.addEventListener("keyup",e=>{e.keyCode===13&&L(e)});
