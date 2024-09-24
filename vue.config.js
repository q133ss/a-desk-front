module.exports = {
    configureWebpack: {
        stats: {
            warnings: false,  // скрывает предупреждения
        },
    },
    // или используя chainWebpack для более детальной настройки
    chainWebpack: (config) => {
        config.plugins.delete('friendly-errors');
    },
};
