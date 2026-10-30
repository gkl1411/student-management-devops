function fn() {
  // baseUrl can be passed as -DbaseUrl=..., otherwise defaults to the local app
  var baseUrl = karate.properties['baseUrl'] || 'http://localhost:3000';
  return { baseUrl: baseUrl };
}
