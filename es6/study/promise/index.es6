let p = new Promise ( (resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 2000);
});

p.then( (data) => {
  console.log(data);
});