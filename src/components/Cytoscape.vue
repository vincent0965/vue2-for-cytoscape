<template>
    <div class="cy-container">
      <div id="cy" class="cy">
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import  cytoscape from 'cytoscape';
  import { computed, defineComponent, nextTick, onMounted, reactive, ref, toRef, watch } from '@vue/composition-api';
  import { nodeData, edgeData } from './graphData';
  
  export default defineComponent({
  name: 'Cytoscape',
  components: {},
  setup() {
    const cyRef = ref();
    const nodeInfo: string[] = reactive(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    const tradeCompany: string[] = reactive(['', '', '']);
    const tradeData: any[] = reactive([]);
    const dubbleClick = reactive([]);
    const feedbackText = ref('');

    onMounted(() => {
      //console.log(cyRef);
      const cy = cytoscape({
        container: cyRef.value,
        elements: {
          nodes: nodeData,
          edges: edgeData,
        },
        style: [
          {
            selector: 'node',
            style: {
              'background-color':
                //'#FFF0D4',
                function (ele) {
                  return ele.data('type') == 'type1'
                    ? '#47D2AC'
                    : ele.data('type') == 'type2'
                    ? '#2196F4'
                    : ele.data('type') == 'type3'
                    ? '#EAA829'
                    : ele.data('type') == 'type4'
                    ? '#FFF0D4'
                    : ele.data('type') == 'type5'
                    ? '#FFB5B5'
                    : 'white';
                },
              //label or content
              //'label':'data(name)',
              content: function (ele) {
                return ele.data('Company') || ele.data('content').company || ele.data('id');
              },
              //'pie-size': '200%',
              'text-valign': 'center',
              //'shape': 'rectangle',
              height: function (ele) {
                return ele.data('type') == 'type5' ? 100 : 50;
              },
              width: function (ele: any) {
                return ele.data('type') == 'type5' ? 100 : 50;
              },
              //'text-opacity':0.5, //透明度
              //'text-outline-width': 0.5,
              //'text-outline-color': '#888',
              'font-size': 25,
            },
          },
          {
            selector: 'edge[arrow]', //上游箭頭(預設無 需要自己加上去)
            style: {
              // 'width': 8,
              // 'line-color': '#ddd',
              'source-arrow-color': '#FF2626',
              //'source-arrow-shape': 'data(arrow)', //改這邊
              'curve-style': 'straight', //straight
            },
          },
          {
            selector: 'edge', //下游箭頭(預設有)
            style: {
              width: 8,
              'line-color': '#ddd',
              'target-arrow-color': '#FF2626',
              'target-arrow-shape': 'triangle',
              'curve-style': 'straight',
              //'content': 'data(info)',
            },
          },
          {
            selector: 'node:selected',
            style: {
              'background-color': 'red',
              'border-color': '#22ee00',
            },
          },
          {
            selector: 'edge:selected',
            style: {
              'line-color': 'red',
              // 'content': 'data(info)',
            },
          },
          {
            selector: '.multiline',
            style: {
              'text-wrap': 'wrap',
              'text-max-width': '100',
            },
          },
          {
            selector: ':parent',
            style: {
              'text-valign': 'top',
              'text-halign': 'center',
              'background-color': '#ECF5FF',
              'font-size': 30,
            },
          },
        ],
        layout: {
          name: 'preset',
          //rows: 1,
          padding: 10,
          //directed: true,
        },
        wheelSensitivity: 0.1, //縮放快慢
        minZoom: 0.3, //最小縮小比例
        //boxSelectionEnabled: true,
        //autounselectify: true, //持續點選狀態
      });

      //event
      //單擊node
      cy.on('click', 'node', ele => {
        var n = ele.target;
        n.removeClass('nodeActive');
        cy.collection('node').removeClass('nodeActive');

        nodeInfo.length = 0;
        nodeInfo.push(n.data('content').company);
        nodeInfo.push(n.data('content').companyStatus);
      });
      //單擊edge
      cy.on('click', 'edge', ele => {
        var e = ele.target;
        e.removeClass('edgeActive');
        cy.collection('edge').removeClass('edgeActive');

        //交易資料分為交易企業(tradeCompany)以及交易資料(tradeData)
        tradeCompany.length = 0; //init
        //交易企業
        tradeCompany.push(e.data('info')[0].company);
        tradeCompany.push(e.data('info')[1].company);
        //電子發票交易總金額
        var sumPrice = 0;
        for (var i = 2; i < e.data('info').length; i++) {
          sumPrice += Number(e.data('info')[i].AMT_total);
        }
        tradeCompany.push(sumPrice.toString());

        //交易資料
        tradeData.length = 0;
        for (var i = 2; i < e.data('info').length; i++) {
          tradeData.push(e.data('info')[i]);
        }
        console.log('tradeData:', tradeData);
      });

      //定義雙點擊事件
      var tappedBefore:any;
      var tappedTimeout:any;
      cy.on('tap', function (event) {
        var tappedNow = event.target;
        if (tappedTimeout && tappedBefore) {
          clearTimeout(tappedTimeout);
        }
        if (tappedBefore === tappedNow) {
          tappedNow.trigger('doubleTap');
          tappedBefore = null;
        } else {
          tappedTimeout = setTimeout(function () {
            tappedBefore = null;
          }, 300);
          tappedBefore = tappedNow;
        }
      });

      //使用雙點擊事件
      cy.on('doubleTap', 'node', function (event) {
        var n = event.target;
        dubbleClick.length = 0;
        dubbleClick.push(n.data('content').company);
        console.log('我是dubbleClick的結果:', dubbleClick);
      });

      //雙點擊事件1-收攏中心點
      cy.on('doubleTap', 'node', function (event) {
        var clickNodes = event.target;
        var hanabi:any = [];

        //取出clickNodes連接的邊
        var connectedEdge = clickNodes.connectedEdges();
        //取出connectedEdge的source node
        var leafNodeS = connectedEdge.source();
        //取出connectedEdge的target node
        var leafNodeT = connectedEdge.target();

        var centerNode:any;

        //判斷center
        if (clickNodes == leafNodeS) {
          centerNode = leafNodeT;
        } else {
          centerNode = leafNodeS;
        }

        // 取出每一個從中心點出發的edge
        var leafEdge = centerNode.connectedEdges(function (el:any) {
          return el.forEach();
        });

        //去除clickNode
        for (var i = 0; i < leafEdge.length; i++) {
          if (leafEdge[i].data().id == connectedEdge.data().id) {
            leafEdge.splice(i, 1);
          }
        }

        var targetLeaf = leafEdge.targets();
        Array.prototype.push.apply(hanabi, targetLeaf); //將target leaf放入到hanabi陣列中
        var sourceLeaf = leafEdge.sources();
        Array.prototype.push.apply(hanabi, sourceLeaf); //將source leaf放入到hanabi陣列中

        //去除centerNode
        for (var i = 0; i < hanabi.length; i++) {
          if (hanabi[i].data().id == centerNode.data().id) {
            hanabi.splice(i, 1);
          }
        }

        //遍歷leaf is target node
        // for (;;) {
        //   //center node is source, find all target edge.
        //   var leafEdgeSource = leafNodeS.connectedEdges(function (el) {
        //     return el.sources().anySame(leafNodeS);
        //   });

        //   //center node is target, find all source edge.
        //   // var leafEdgeTarget = leafNodeT.connectedEdges(function (el) {
        //   //   //判斷被點擊的node相鄰的edge 是否是target等於nodes 有則回傳true 無則回傳false
        //   //   //console.log(el);
        //   //   //console.log(!el.target().anySame(leafNodeT));
        //   //   return !el.target().anySame(leafNodeT);
        //   // });

        //   console.log('這是中心點接source的edge', leafEdgeSource);
        //   //console.log('這是中心點接target的edge', leafEdgeTarget);

        //   //find target leaf node
        //   var targetLeaf = leafEdgeSource.targets();

        //   //find source leaf node
        //   //var sourceLeaf = leafEdgeTarget.sources();

        //   console.log('這是目標節點', targetLeaf);
        //   //console.log('這是初始節點', sourceLeaf);

        //   Array.prototype.push.apply(hanabi, targetLeaf); //將target leaf放入到hanabi陣列中
        //   //Array.prototype.push.apply(hanabi, sourceLeaf); //將source leaf放入到hanabi陣列中

        //   console.log(hanabi);

        //   leafNodeS = targetLeaf;

        //   //確認遍歷完 跳出迴圈
        //   if (leafNodeS.empty()) {
        //     break;
        //   }
        // }

        var delay = 10;
        for (var i = hanabi.length - 1; i >= 0; i--) {
          (function () {
            //thisHanabi為中心周圍的點 依照hanabi陣列取出
            var thisHanabi = hanabi[i];
            thisHanabi
              .delay(delay, function () {
                //新增一個class到被點擊的node
                centerNode.addClass('center');
              })
              //點擊後的行為
              .animate(
                {
                  position: centerNode.position(),
                },
                {
                  duration: 750,
                  complete: function () {
                    //將點刪除
                    thisHanabi.remove();
                  },
                }
              );
          })();
        } // for
      }); // on tap
    });

    return { cyRef, nodeInfo, tradeCompany, tradeData, dubbleClick, feedbackText };
  },
  // watch:{
  //   info:"initInfo",
  // },
});
</script>
  
  <style>
  .cy-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background:#F5FFE8;
    z-index: 1;
  }
  .cy-container .cy {
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .cy-container .info {
    background: #fff;
    position: absolute;
    left: 50px;
    bottom: 50px;
    z-index: 9;
  }
  .cy-container .types {
    position: absolute;
    left: 50px;
    top: 50px;
    z-index: 9;
  }
  .cy-container .types span {
    display: inline-block;
    background: #a5abb6;
    border-radius: 4px;
    margin-right: 10px;
    padding: 5px 6px;
    cursor: pointer;
    color: #2e0f00;
    font-size: 12px;
  }
  
  </style>
