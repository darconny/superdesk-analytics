ProcessedItemsChart.$inject = ['chartManager', 'gettext', 'moment'];

/**
 * @ngdoc service
 * @module superdesk.apps.analytics.processed-items-report
 * @name ProcessedItemsChart
 * @description Processed items chart generation service
 */
export function ProcessedItemsChart(chartManager, gettext, moment) {
    /**
     * @ngdoc method
     * @name ProcessedItemsChart#createChart
     * @param {Object} processedItemsReport
     * @description Creates a chart for the given report
     */
    this.createChart = function(processedItemsReport, renderTo) {
        var endTime = moment();
        var startTime = moment().subtract(processedItemsReport.time_interval.count,
            processedItemsReport.time_interval.measure);
        var series = [];

        for (var i = 0; i <= processedItemsReport.report.length - 1; i++) {
            series.push({
                name: processedItemsReport.report[i].user.display_name,
                data: [
                    processedItemsReport.report[i].processed_items.published_items,
                    processedItemsReport.report[i].processed_items.corrected_items,
                    processedItemsReport.report[i].processed_items.spiked_items,
                    processedItemsReport.report[i].processed_items.killed_items,
                    processedItemsReport.report[i].processed_items.total_items
                ]
            });
        }

        var options = {
            id: 'processed-items',
            chart: {
                type: 'column'
            },
            title: {
                text: startTime.calendar() + ' - ' + endTime.calendar()
            },
            xAxis: {
                categories: [gettext('Published'), gettext('Corrected'), gettext('Spiked'),
                    gettext('Killed'), gettext('Total')]
            },
            yAxis: {
                title: {
                    text: gettext('Items No')
                }
            },
            series: series
        };

        return chartManager.create(renderTo, options);
    };
}