export default function(file, callback){
  let formData = new FormData();
  formData.append('uploadFile', file);
  formData.append('method', 'UPLOAD-PHOTO');
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/form-data' },
    data: formData,
    url: '/api',
  };
  this.$http(options).then(res => {
    callback(res);
  })
  .catch(err => console.log(err));
}