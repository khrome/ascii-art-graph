var should = require('chai').should();
var Graph = require('../graph');
var fs = require('fs');

var simple = fs.readFileSync(__dirname+'/data/simpleLineGraph.json');
var multi = fs.readFileSync(__dirname+'/data/multiLineGraph.json');


describe('ascii-art-graph', function(){
    it('renders a small single graph', function(done){
        var graph = new Graph.Timeseries({
            height : 20,
            width : 80,
            node : '@',
            line : '`',
            timeField : 'date',
            valueField : 'value'
        });
        graph.render({
            'timeseries' : [
              {
                value: 2,
                date: '2019-11-25T01:55:45.000Z',
              },
              {
                value: 5,
                date: '2019-11-25T01:56:45.000Z',
              },
              {
                value: 3,
                date: '2019-11-25T01:58:45.000Z',
              },
              {
                value: 11,
                date: '2019-11-25T01:59:45.000Z',
              }
            ]
        }, function(err, result){
            should.not.exist(err);
            should.exist(result);
            result.should.equal(simple.toString());
            done();
        });
    });

    it('renders a small multi-series graph', function(done){
        var graph = new Graph.Timeseries({
            height : 20,
            width : 80,
            node : '@',
            line : '`',
            timeField : 'date',
            valueField : 'value',
            colors : ['red', 'blue']
        });
        graph.render({
            'timeseries-a' : [
              {
                value: 2,
                date: '2019-11-25T01:55:45.000Z',
              },
              {
                value: 5,
                date: '2019-11-25T01:56:45.000Z',
              },
              {
                value: 3,
                date: '2019-11-25T01:58:45.000Z',
              },
              {
                value: 11,
                date: '2019-11-25T01:59:45.000Z',
              }
          ],
          'timeseries-b' : [
            {
              value: 10,
              date: '2019-11-25T01:55:45.000Z',
            },
            {
              value: 8,
              date: '2019-11-25T01:56:45.000Z',
            },
            {
              value: 4,
              date: '2019-11-25T01:58:45.000Z',
            },
            {
              value: 6,
              date: '2019-11-25T01:59:45.000Z',
            }
          ]
        }, function(err, result){
            should.not.exist(err);
            should.exist(result);
            result.should.equal(multi.toString());
            done();
        });
    });
});

/*

{
  'design:my-project:mvp': [
    {
      activity: 'design',
      complete: 2,
      'creation-date': '2019-11-25T01:55:45.000Z',
      'modification-date': '2019-11-25T01:55:45.000Z',
      date: '2019-11-25T01:55:45.000Z',
      scope: 'my-project:mvp'
    },
    {
      activity: 'design',
      complete: 4,
      'creation-date': '2019-11-25T01:55:45.000Z',
      'modification-date': '2019-11-25T01:55:46.000Z',
      date: '2019-11-25T01:55:46.000Z',
      scope: 'my-project:mvp',
      total: 10
    },
    {
      activity: 'design',
      complete: 6,
      'creation-date': '2019-11-25T01:55:45.000Z',
      'modification-date': '2019-11-25T01:55:48.000Z',
      date: '2019-11-25T01:55:48.000Z',
      scope: 'my-project:mvp',
      total: 10
    },
    {
      activity: 'design',
      complete: 10,
      'creation-date': '2019-11-25T01:55:45.000Z',
      'modification-date': '2019-11-25T01:55:51.000Z',
      date: '2019-11-25T01:55:51.000Z',
      scope: 'my-project:mvp',
      total: 10
    }
  ],
  'programming:my-project:mvp': [
    {
      activity: 'programming',
      complete: 2,
      'creation-date': '2019-11-25T01:55:47.000Z',
      'modification-date': '2019-11-25T01:55:47.000Z',
      date: '2019-11-25T01:55:47.000Z',
      scope: 'my-project:mvp'
    },
    {
      activity: 'programming',
      complete: 5,
      'creation-date': '2019-11-25T01:55:47.000Z',
      'modification-date': '2019-11-25T01:55:49.000Z',
      date: '2019-11-25T01:55:49.000Z',
      scope: 'my-project:mvp',
      total: 15
    }
  ],
  'design:my-project:ui-spec': [
    {
      activity: 'design',
      complete: 2,
      'creation-date': '2019-11-25T01:55:52.000Z',
      'modification-date': '2019-11-25T01:55:52.000Z',
      date: '2019-11-25T01:55:52.000Z',
      scope: 'my-project:ui-spec'
    }
  ]
}


*/
