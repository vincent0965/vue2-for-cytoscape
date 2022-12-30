<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="cy-container">
    <button @click = clean()>clean</button>
    <HomeView class="showInfo" :info="info" />
    <div id="cy" class="cy">
    </div>
  </div>
</template>

<script lang="ts">
import  cytoscape from 'cytoscape';
import { computed, createApp, defineComponent, nextTick, onMounted, reactive, ref, toRef, watch } from '@vue/composition-api';
import HomeView from '@/views/HomeView.vue';
import { nodeData, edgeData } from './graphData';

export default defineComponent ({
  //name: 'Cytoscape',
  components:{
    HomeView
  },
  data() {
    return {
      info:[], //傳輸完資料後要init
    };
  },

  mounted(){
    
    const cy = cytoscape({

    container : document.getElementById('cy'),
      
    elements:{
      nodes: nodeData,
      edges: edgeData,
    },

    style: [ 
      { 
        selector: 'node',
        style: {
          'background-color': 
          //'#FFF0D4',
          function(ele){
            return ele.data('type') == 'type1' ? '#47D2AC' : ele.data('type') == 'type2' ? '#2196F4' : ele.data('type') == 'type3' ? '#EAA829' : ele.data('type') == 'type4' ? '#FFF0D4' : ele.data('type') == 'type5' ? '#FFB5B5':'white'
          },
          //label or content 
          //'label':'data(name)',
          'content':function(ele){
            return ele.data('Company') || ele.data('id')
          },
          //'pie-size': '200%',
          'text-valign': 'center',
          //'shape': 'rectangle',
          'height':function(ele){
            return ele.data('type') == 'type5' ? 100 : 50
          },
          'width':function(ele:any){
            return ele.data('type') == 'type5' ? 100 : 50
          }, 
          //'text-opacity':0.5, //透明度
          //'text-outline-width': 0.5,
          //'text-outline-color': '#888',
          'font-size':25
          }
      },{ 
        selector: 'edge[arrow]', //上游箭頭(預設無 需要自己加上去)
        style: {
          // 'width': 8,
          // 'line-color': '#ddd',
          'source-arrow-color': '#FF2626',
          //'source-arrow-shape': 'data(arrow)',
          'curve-style': 'straight', //straight
        }
      },{          
        selector: 'edge', //下游箭頭(預設有)
        style: {
          'width': 8,
          'line-color': '#ddd',
          'target-arrow-color': '#FF2626',
          'target-arrow-shape': 'triangle',
          'curve-style': 'straight',
          //'content': 'data(info)',
        }
      },{
        selector: 'node:selected',
        style: {
          'background-color': 'red',
          'border-color': '#22ee00'
        }
      },{
        selector: 'edge:selected',
        style: {
          'line-color': 'red',
          // 'content': 'data(info)',
        }
      },{
        selector: '.multiline',
        style: {
          'text-wrap': 'wrap',
          'text-max-width': '100'
        }
      },{
        selector: ':parent',
        style: {
          'text-valign': 'top',
          'text-halign': 'center',
          'background-color':'#ECF5FF',
          'font-size':30,
        }
      },
    ],
    layout: {
      name: 'preset',
      //rows: 1,
      padding:10,
      //directed: true,
    },
    wheelSensitivity:0.3, //縮放快慢
    minZoom:0.5 //最小縮小比例
    })


    //event
    cy.on("click", "node",  (ele) => {
      let n = ele.target
      n.removeClass("nodeActive")
      cy.collection("node").removeClass("nodeActive")
      let nodeForm = '';
      nodeForm = (n.data('id') +','+ n.data('Company') +','+ n.data('Location') +','+ n.data('統一編號'))
      this.info=[]
      this.info.push(nodeForm)
      //console.log(n.data('id'))
      //console.log('nodeform:' + nodeform)
    })

    cy.on("click", "edge" , (ele) => {
      let e = ele.target
      e.removeClass("edgeActive")
      cy.collection("edge").removeClass("edgeActive")

      let edgeForm=''
      this.info=[]
      for(let i = 0 ; i < 10 ; i++ ){
        edgeForm=(e.data('info')[i].title +','+ e.data('info')[i].price +','+ e.data('info')[i].number)
        this.info.push(edgeForm) //never and string
        console.log(edgeForm)
      }

      //this.info.push(edgeArray)
      //console.log(e.data('id'))
      //console.log(info)
    })

  },
  methods:{
    clean(){
      this.info=[]
    }
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
