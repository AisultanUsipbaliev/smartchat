const install = Vue => {
 Vue.directive('dropper', {
    bind (el, binding, vnode) {
      el.addEventListener('dragover', e =>{
      	e.preventDefault();
      	document.getElementById(binding.value.draganddrop).style.display = "flex";
      })
      document.addEventListener('dragover', e =>{
      	e.preventDefault();
      	let end = false;
      	for (let i = 0; i < e.path.length; i++)
      		if(e.path[i].classList)
      		if(e.path[i].classList.value == 'chat')
      			end = true;
    		if(!end) document.getElementById(binding.value.draganddrop).style.display = "none";
      })
      el.addEventListener('drop', e =>{
      	e.preventDefault();
      	document.getElementById(binding.value.draganddrop).style.display = "none";
        binding.value.endF(e);
      })
    }
  })
}

export default {install}