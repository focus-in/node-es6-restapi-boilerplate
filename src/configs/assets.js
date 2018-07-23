module.exports = {
  system: 'src/system/**/*.js',
  libs: 'src/configs/libs/*.js',
  strategies: 'src/configs/strategies/*.js',
  modules: 'src/modules/*/*.js',
  models: 'src/modules/*/models/*.js',
  routers: 'src/modules/*/routers/*.js',
  scripts: 'src/modules/*/scripts/*.js',
  configs: 'src/modules/*/configs/*.js',
  all: ['src/configs/**/*.js', 'src/system/**/*.js', 'src/modules/**/*.js'],
};
