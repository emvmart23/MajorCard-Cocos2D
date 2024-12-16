module.exports = {
  getRandomCards: function(arr, n) {
      var shuffled = arr.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
  }
};