(function (root, factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['ascii-art-ansi', 'd3', 'json2csv'], factory);
    }else if (typeof module === 'object' && module.exports){
        module.exports = factory(
            require('ascii-art-ansi'),
            require('d3'),
            require('json2csv')
        );
    }else{
        // Browser globals (root is window)
        root.AsciiArtGraph = factory(root.AsciiArtAnsi, root.d3);
    }
}(this, function(ansi, d3, j2c){
    var toCSV = j2c.parse;

    var ObjectMap = function(obj, mapFn){
        var mapped = {};
        Object.keys(obj).forEach(function(key, index){
            mapped[key] = mapFn(obj[key], key, index);
        });
        return mapped;
    };

    var Timeseries = function(options){
        if(!options.node) options.node = '*';
        if(!options.line) options.line = '`';
        if(!options.d3Conversion) options.d3Conversion = function(history){
            var allHistory = Object.keys(history).reduce(function(agg, key){
                return agg.concat(history[key]);
            }, [])
            var flatData = toCSV(allHistory, {
                flatten: true,
            });
            return flatData;
        }
        this.options = options || {};
    }

    Timeseries.prototype.render = function(series, cb){
        //todo: support arg overrides in render
        var options = this.options;
        var height = options. height || 40;
        var width = options.width || 100;
        var series;
        var xParse = options.xParse || d3.timeParse("%Y-%m-%dT%H:%M:%S.%fZ");
        var yParse = options.yParse || function(i){return i};
        var flattened = Object.assign(
            (d3.csvParse(options.d3Conversion(series), d3.autoType)).map(
                function(item){
                    return {
                        date: item[options.timeField || 'date'],
                        value: item[options.valueField || 'value']
                    }
                }
            ),
            {y: "$ Close"}
        );
        var x = d3.scaleUtc()
            .domain(d3.extent(flattened, function(d){
                return d['date'];
            }))
            .range([0, width]);
        var y = d3.scaleLinear()
            .domain([0, d3.max(flattened, function(d){
                return d['value']
            })]).nice()
            .range([0, height]);
        var grid = [];
        for(var h = height; h >= 0; h--){
            if(!grid[h]) grid[h] = [];
            for(var w = 0; w < width; w++){
                grid[h][w] = options.space || ' ';
            }
        }
        ObjectMap(series, function(data, key, index){
            var moments = data.map(function(item){
                var res = x(xParse(item[options.timeField || 'date']));
                if(Number.isNaN(res)) throw new Error('x projection not real');
                return res;
            });
            var values = data.map(function(item){
                return y(yParse(item[options.valueField || 'value']));
            });
            var previous;
            var previousValue;
            var first = moments[0];
            var inflections = moments.map(function(moment){
                return Math.floor(moment) - first;
            });
            var color = (options.colors && options.colors[index % options.colors.length]);
            var value;
            inflections.forEach(function(inflection, index){
                value = Math.floor(values[index])
                grid[value][inflection] = color?
                    ansi.codes(options.node, color, true):
                    options.node;
                var dx = (inflection - previous);
                var dy = (value - previousValue);
                var dd = dy/dx;
                if(previous !== undefined){
                    var can
                    for(var x=previous+1; x < inflection; x++){
                        can = previousValue + Math.floor((x - previous) * dd);
                        grid[can][x] = color?
                            ansi.codes(options.line, color, true):
                            options.line;
                    }
                }
                previousValue = value;
                previous = inflection
            });
        });
        if(cb) cb(undefined, grid.reverse().map(function(chars){
            return ' '+chars.join("")
        }).join("\n "));
    }

    var Graph = {};
    Graph.Timeseries = Timeseries;
    return Graph;
}));
