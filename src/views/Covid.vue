<template>
  <div class="container">
    <v-spacer></v-spacer>

    <div class="row col-md-12 mt-3">
        <img src="@/assets/logo_unime.png" alt="logo da unime" class="mx-auto" :width="160">
    </div>
   <div v-if="success == null || success == false" class="main mt-5">
     
    <div class="row col-md-4">
      <label for="selectEstado" class="red--text col-md-12">Buscar pelo Estado(UF)</label>
      <select name="selectEstado" id="selectEstado" v-model="selected" @change="verificarAlteracao">
       <option value="">Selecione um Estado</option>
     </select>
    </div>

    <div v-if="success === null" class="row col-md-12">
      <div class="col-md-6 row border-dashed pr-3">
        
        <div class="col-md-4">
          <img src="@/assets/interrogacao.svg" alt="interrogacao" width="125">
        </div>

        <div class="col-md-8 mt-7">
          <h1 class="text-default">COVID 2019</h1>
          <h4 class="text-default">Fique em casa e se cuide!</h4>
        </div>
        
      </div>
    </div>

    <div v-if="error" class="row col-md-12">
      <div class="col-md-6 row border-dashed-danger pr-3">
        
        <div class="col-md-4 mt-3">
          <img src="@/assets/exclamacao.png" alt="interrogacao" width="125">
        </div>

        <div class="col-md-8 mt-7">
          <h1 class="text-danger">OPS!!!</h1>
          <h4 class="text-danger">Não foi possivel carregar os dados para apresentação</h4>
        </div>
        
      </div>
    </div>
   </div>

   <div class="child" v-if="success">
     <div class="row col-md-12">
       <div class="col-md-6 mt-1">
          <label for="selecteState" class="form-label font-weight-bold red--text">Buscar pelo Estado (UF)</label>
          <div class="row mt-3 col-md-12">
            <select name="selectEstado" id="selectEstado" width="10" class="" v-model="selected" @change="verificarAlteracao" >
              <option v-for="estado of estados" v-bind:value="estado.sigla" :key="estado">{{estado.nome}}</option>
           </select>
          </div>
       </div>
  
       <div class="col-md-6 mt-12 white--text red darken-1 rounded-lg" style="height: 3.5em">
         <p class="font-weight-bold text-center mt-1">Atualizado em: {{data}}</p>
       </div>

       <div class="col-md-6 mt-3">
         <label class="text-danger font-weight-bold red--text">Número de casos (Confirmados)</label>
         <v-text-field v-model="numCasos" filled disabled></v-text-field>
       </div>

       <div class="col-md-6 mt-3">
         <label class="text-danger font-weight-bold red--text">Número de óbitos</label>
         <v-text-field v-model="numObitos" filled disabled></v-text-field>
       </div>
       
       <div class="col-md-6 mt-3">
         <label class="text-danger font-weight-bold red--text">Número de casos (Suspeitos)</label>
         <v-text-field v-model="numSuspeitos" filled disabled></v-text-field>
       </div>
       
       <div class="col-md-6 mt-3">
         <label class="text-danger font-weight-bold red--text">Casos rejeitados</label>
         <v-text-field v-model="numRejeitados" filled disabled></v-text-field>
       </div>
     </div>
   </div>
  </div>
</template>

<script>

import axios from 'axios'
import moment from 'moment'

export default { 
  data() {
    return {
      estados: [],
      selected: '',
      numCasos: 0,
      numObitos: 0,
      numSuspeitos: 0,
      numRejeitados: 0,
      data: "",
      success: null,
      error:   null,
      estadoSelecionado: null
    }
  },

  mounted: function()  {
     this.montarEstado();
  },
  methods: {
     async buscarPorEstadoSelecionado(uf) {
        let dataEstado    = "";
        let data          = "";
        let minutos       = "";
       await axios.get(`https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/${uf}`)
       .then(response => {
         
         if(response.data.error) {
           this.error   = true;
           this.success = false;
           return;
         }
         
         this.estadoSelecionado = JSON.parse(response.request.response);
         this.success           = (this.estadoSelecionado.cases != undefined) ? true : null; 
         dataEstado             = new Date(this.estadoSelecionado.datetime);
         data                = moment(dataEstado).format("YYYY-MM-DD");
         minutos             = moment(dataEstado).format("hh:mm:ss");
         this.data           = `${data} ás ${minutos}`;
         this.numCasos       = this.estadoSelecionado.cases;
         this.numObitos      = this.estadoSelecionado.deaths;
         this.numSuspeitos   = this.estadoSelecionado.suspects;
         this.numRejeitados  = this.estadoSelecionado.refuses;
       });

       return false;
     },

     verificarAlteracao() {
       
        if (this.buscarPorEstadoSelecionado(this.selected)) {
          
          if (this.selected.length === 0) {
              this.success = null;
              this.error = null;
              return;
          } 

          this.error   = null;
          this.success = null;          
        }
     },

    montarEstado() {
      axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
      .then(response => {
        response.data.forEach(estado => {
          let selectEstados = document.querySelector('#selectEstado');
          selectEstados.innerHTML += `<option value="${estado.sigla}">${estado.nome}</option>`; 
          this.estados.push(estado);
        });
      });
    }

  }
}
</script>

<style>
  .border-dashed {
    border: 5px dashed #d8d8d8;
    border-radius: 8px;
  }

  .border-dashed-danger {
    border: 5px dashed #f44336;
    border-radius: 8px;
  }

  .text-danger {
    color: #f44336;
  }

  .text-default {
    color: #d8d8d8;
  }

  select,
  #selectEstado {
    height: 3em;
    width: 12em;
    border: 2px solid gray;
    border-radius: 0.5em;
  }
  
</style>