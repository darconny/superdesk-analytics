Chart.$inject = ['chartManager', '$timeout'];

/**
 * @ngdoc directive
 * @module superdesk.apps.analytics.charts
 * @name sdChart
 * @requires chartManager
 * @requires $timeout
 * @description A directive that renders a Highcharts instance given its config
 */
export function Chart(chartManager, $timeout) {
    return {
        scope: {config: '<'},
        template: require('../views/chart.html'),
        link: function(scope, element, attrs) {
            let target = element.find('div');

            scope.$watch('config', (config) => {
                render(config, config.id);
            });

            scope.$on('$destroy', () => {
                chartManager.destroy(scope.config.id);
            });

            /**
             * @ngdoc method
             * @name sdChart#exportChart
             * @description Exports the Highcharts instance to a file
             */
            scope.exportChart = function() {
                chartManager.export(scope.config.id, {
                    type: 'application/pdf',
                    filename: 'chart-pdf',
                });
            };

            scope.$on('analytics:toggle-filters', () => {
                // Wait for the filter panel to finish its hide/show animation
                // before resizing this chart
                $timeout(() => {
                    scope.$applyAsync(() => {
                        chartManager.reflow(scope.config.id);
                    });
                }, 500);
            });

            /**
             * @ngdoc method
             * @name sdChart#render
             * @param {Object} config - The Highcharts config
             * @param {String} name - The ID associated with this Highcharts instance
             * @description Renders this Highcharts instance
             */
            function render(config, name) {
                $timeout(() => {
                    scope.$applyAsync(() => {
                        chartManager.create(target[0], config, name);
                    });
                }, 0);
            }

            /**
             * @ngdoc method
             * @name sdChart#downloadAsCSV
             * @description Using the chartManager, download the chart data as a CSV file
             */
            scope.downloadAsCSV = function() {
                chartManager.downloadCSV(scope.config.id, 'chart.csv');
            };
        },
    };
}
