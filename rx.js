const { Observable } = require('rxjs');

function ob() {
  return new Observable((observer) => {
    observer.next('Loading...');
    setTimeout(() => observer.next('1'), 500);
    setTimeout(() => observer.complete(), 1000);
  });
}

const o = ob();
o.subscribe((e) => console.log(e));
o.toPromise().then((e) => console.log('Res', e));
o.