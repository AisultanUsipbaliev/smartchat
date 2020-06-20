export default function(file, callback, name, ava){
  let formData = new FormData();
  formData.append('uploadFile', file);
  formData.append('method', 'SEND-FILE');
  if(name) formData.append('name', name);
  if(ava) formData.append('photo', true);

  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/form-data' },
    data: formData,
    url: '/api',
  };
  return this.$http(options).then(res => {
    callback(res);
  })
  .catch(err => console.log(err));
} 