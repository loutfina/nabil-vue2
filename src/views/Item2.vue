<template>
  <div class="home container mt-4">
    <div class="text-center">
      <h1>Annexe</h1>
    </div>

    <div class="card">
      <div class="card-header">Critères de recherche</div>
      <div class="card-body">
        <b-form @submit="submit">
          <div class="row mb-2 g-3 align-items-center">
            <div class="col-3">
              <label for="vin" class="col-form-label" id="label-vin">Identifiant</label>
            </div>
            <div class="col-5">
              <input type="text" id="vin" class="form-control"  v-model="vin" aria-labelledby="label-vin">
            </div>
          </div>
          <div class="row mb-2 g-3 align-items-center">
            <div class="col-3">
              <label for="vrn" class="col-form-label" id="label-vrn">Matricule</label>
            </div>
            <div class="col-5">
              <input type="text" id="vrn" class="form-control"  v-model="vrn" aria-labelledby="label-vrn">
            </div>
          </div>
          <div class="row mb-2 g-3 align-items-center">
            <div class="col-3" />
            <div class="col-5 buttons">
              <b-button type="submit" variant="primary"> <b-icon-search /> Rechercher</b-button>
            </div>
          </div>
        </b-form>
      </div>
    </div>

      <div class="card  mt-4">
        <div class="card-header">Liste des véhicules répondant aux critères de recherche</div>
        <div class="card-body">

          <div class="row mb-2 g-3 align-items-center">
            <div class="col-12" v-if="!detailResult">        
              <b-table striped hover small 
                :items="result ? result:[]" 
                :fields="fieldsMini" 
                :busy="status=='pending'" 
                selectable select-mode="single"
                @row-selected="showDetail"
                show-empty
                >
                  <template #table-busy>
                    <div class="text-center text-danger my-2">
                      <b-spinner class="align-middle"></b-spinner>
                    </div>
                  </template>
                  <template #empty="">
                    Aucune donnée à cette date
                  </template>                
              </b-table>

            </div>
            <div class="col-12" v-if="detailResult">          
              <b-table striped hover small :items="result ? result:[]" :fields="fields" :busy="status=='pending'"  show-empty>
                  <template #table-busy>
                    <div class="text-center text-danger my-2">
                      <b-spinner class="align-middle"></b-spinner>
                    </div>
                  </template>
                  <template #empty="">
                    Aucune donnée à cette date
                  </template>  
              </b-table>
            </div>
          </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState( 'idem2Slice',  ['result','status'])
  },
})

export default class Devi extends Vue {
    vin = '';
    vrn = '';
    checkDatetime?:Date= undefined;
    is_rg = false;
    detailResult =  false;

    fieldsMini:Array<any> = [
          { key: 'vrn', sortable: true, label:'N° Matricule' },
          { key: 'vin', sortable: true, label:'N° Identifiant' }
        ];

    fields:Array<any> = [
          { key: 'OP', sortable: true, label:'Code opération' },
          { key: 'CA', sortable: true, label:'Code CA' },
          { key: 'police', sortable: true, label:'N°' },
          { key: 'avenant', sortable: true, label:"N° annexe" },
          { key: 'receptionDate', sortable: true, label:'Date de réception' },
          { key: 'sendDate', sortable: true, label:"Date d'émission" },
          { key: 'effectiveDate', sortable: true, label:"Date d'effet" },
          { key: 'label', sortable: true, label:"Desc" }
        ];

     search (vin:string, vrn:string):void{
      this.$store.dispatch('idem2Slice/search',{ vin, vrn })
      this.detailResult = (!!vin && !!vrn);
    }

    showDetail(row:any):void {
      if (row && row.length>0){
        this.vin =  row[0].vin;
        this.vrn = row[0].vrn;
        this.search(row[0].vin, row[0].vrn);
      }
    } 

    submit(event:Event){
      event.preventDefault();
      this.search(this.vin, this.vrn);
    }
}
</script>
