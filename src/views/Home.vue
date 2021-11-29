<template>
  <div class="home container mt-4">

      <div class="card">
        <div class="card-header">Critères de recherche</div>
        <div class="card-body">
          <b-form @submit.prevent="search">
            <div class="row mb-2 g-3 align-items-center">
              <div class="col-3">
                <label for="vin" class="col-form-label" id="vin">Identifiant</label>
              </div>
              <div class="col-5">
                <input type="text" id="vin" class="form-control"  v-model="vin"  aria-labelledby="vin" :disabled="is_rg">
              </div>
            </div>

            <div class="row mb-2 g-3 align-items-center">
              <div class="col-3">
                <label for="vrn" class="col-form-label" id="vrn">Matricule</label>
              </div>
              <div class="col-5">
                <input type="text" id="vrn" class="form-control" v-model="vrn" aria-labelledby="vrn">
              </div>
            </div>

            <div class="row mb-2 g-3 align-items-center">
              <div class="col-3">
                <label for="checkDatetime" class="col-form-label" >Date de vérification</label>
              </div>
              <div class="col-3">
                  <b-form-datepicker
                    id="checkDate"
                    :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                    today-button
                    locale="fr"
                    :value-as-date=true
                    v-model="checkDate" 
                    :min="minDate" 
                    :max="maxDate"
                    aria-label="Date (jour, mois, année) de vérification"
                    />
              </div>
              <div class="col-2">
                  <b-form-timepicker 
                    v-model="checkTime" 
                    locale="fr" 
                    :hour12=false 
                    aria-label="heure (heures, minutes) de vérification"
                    />

              </div>
            </div>
            <div class="row mb-2 g-3 align-items-center">
              <div class="col-3">
                <label for="is_rg" class="col-form-label" id="label-rg">Sans identifiant</label>
              </div>
              <div class="col-5 ps-2">
                  <b-form-checkbox switch v-model="is_rg" name="is_rg" size="lg" id="is_rg" aria-labelledby="label-rg"></b-form-checkbox>
              </div>
            </div>
            <div class="row mb-2 g-3 align-items-center">
              <div class="col-3" />
              <div class="col-5 buttons">
                <b-button type="submit" variant="primary" aria-label="Rechercher"> <b-icon-search /> Rechercher</b-button>
              </div>
            </div>

          </b-form>         
        </div>
    </div>

      <div class="card  mt-4">
        <div class="card-header">Résultats</div>
        <div class="card-body">
          <div class="row mb-2 g-3 justify-content-md-center">
            <div class="col-6 align-items-center">
              <b-alert :variant=coverage_alert.variant :show=coverage_alert.show fade>
                <div class="text-center h2">Couvert ({{coverage_alert.date}})</div>
              </b-alert>
            </div>
          </div>
          <div class="row mb-2 g-3">
            <div class="col-2"></div>
            <div class="col-5">
                 <label v-show="result.vuuid">Identifiant :</label> {{result.vuuid ||''}}
            </div>
          </div>

          <div class="row mb-2 g-3 align-items-center">
            <div class="col-12">
              <b-table striped hover small :items="result.coverages" :fields="fields" :busy="status=='pending'" show-empty>
                  <template #table-busy>
                    <div class="text-center text-danger my-2">
                      <b-spinner class="align-middle"></b-spinner>
                    </div>
                  </template>
                  <template #empty="">
                    <div class="text-center p-5" v-show="submited">
                      <h4>Aucune donnée à cette date</h4>
                    </div>
                  </template>
                  <template #cell(creationDate)="data">
                      {{data.item.creationDate ? new Date(data.item.creationDate).toLocaleDateString() : '' }}
                  </template>
                  <template #cell(Action)="data">
                      <b-button variant="outline-secondary" @click="print(data.item)" size="sm" v-if="data.item.startDate">
                        <b-icon icon="file-earmark-arrow-down-fill" aria-label="Télécharger l'attestation" title="Télécharger l'attestation"/>
                      </b-button>
                      <b-button variant="outline-secondary" @click="printPDFSigned(data.item)" size="sm" v-if="data.item.endDate && hasRole('ITS4U_PDFSigned')">
                        <b-icon icon="printer-fill" aria-label="Télécharger attestation de non-couverture d’un véhicule" title="Télécharger attestation de non-couverture d’un véhicule"/>
                      </b-button>
                  </template>
              </b-table>

            </div>
          </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapState, mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapState( 'rcaSlice',  ['result','status']),
    ...mapGetters( 'useSlice', ['hasRole']),
    ...mapState( 'useSlice',  ['user'])
  },
  created(){
    this.$data.MIGRATION_CUT_DATE = this.$config.MIGRATION_CUT_DATE; // not really needed
    this.$data.minDate = new Date(this.$config.MIGRATION_CUT_DATE);
  }
})
export default class Home extends Vue {
    today = new Date();
    checkTime = this.today.getHours() + ":"+this.today.getMinutes();
    maxDate = this.today;
    MIGRATION_CUT_DATE = '2015-07-01'; // this value should be overrided by the app-config.json value
    minDate = new Date(this.MIGRATION_CUT_DATE);
    checkDate = this.today;
    checkDatetime= this.today;
    vin = '';
    vrn = '';
    is_rg=false;
    coverage_alert={variant: 'success', show: false, date : '12/08/2025 11:30'}; // 'danger' or 'success'
    submited = false;


    fields:Array<any> = [
          { key: 'creationDate', sortable: true, label:'Date' },
          { key: 'startDate', sortable: true, label:'Start' },
          { key: 'endDate', sortable: true, label:'End' },
          { key: 'insurance.name', sortable: true, label:'Assurance' },
          { key: 'vin', sortable: true, label:'N° châssis' },
          { key: 'vrn', sortable: true, label:'N° plaque' },
          { key: 'coverage', sortable: true, label:'N°' },
          { key: 'version', sortable: true, label:'Vers.' },
          'Action'
        ];
        
    search():void{
      if ( ! this.checkDatetime || this.checkDatetime.getTime() > new Date().getTime() ){
        this.$store.dispatch('alertSlice/error', "La date de vérification ne peut pas être dans le futur. Veuillez modifier la date de vérification.");
      } else if ( ! this.checkDatetime || this.checkDatetime.getTime() < this.minDate.getTime() ){
        this.$store.dispatch('alertSlice/error', "La date de vérification ne peut pas être dans le futur. Veuillez modifier la date de vérification.");
      } else if (this.is_rg && !this.vrn){
        this.$store.dispatch('alertSlice/error', "Pour une recherche de plaque rouge, veuillez indiquer un numéro d'immatriculation.");
      } else if (!this.vin && !this.vrn){
        this.$store.dispatch('alertSlice/error', "Veuillez indiquer au moin un numéro de châssis ou un numéro d’immatriculation.");
      } else {
        this.submited = true;
        this.$store.dispatch('rcaSlice/search',{ vin:this.vin, vrn : this.vrn, checkDatetime: this.checkDatetime, is_rg: this.is_rg });
        this.coverage_alert.show = true;
      }
    }

    print(item:any):void{
      this.$store.dispatch('rcaSlice/print',item)
    }

    printPDFSigned(item:any):void{
      this.$store.dispatch('rcaSlice/printPDfSigned',item)
    }

    setTimeToDate(value:string):void{
      if (value && this.checkDatetime instanceof Date && !isNaN(this.checkDatetime.valueOf())){
        let timeArray:string[] = value.split(":");
        this.checkDatetime.setHours(parseInt(timeArray[0]), parseInt(timeArray[1]));
      }
    }

    @Watch('checkTime')
    onCheckTimeChanged(newValue:any) {
      this.setTimeToDate(newValue);
    }

    @Watch('checkDate')
    onCheckDateChanged(newValue:any) {
      if (newValue){
        this.checkDatetime = new Date(newValue.getTime());
        this.setTimeToDate(this.checkTime);
      } else {
        this.checkDatetime = newValue;
      }
    }

    @Watch('is_rg')
    onRGChanged(newValue:any){
      if(newValue)
        this.vin = '';
    }

}
</script>

<style lang="css">
#is_rg.custom-control-input:checked ~ .custom-control-label::before {
    color: #fff;
    border-color: #ff0000;
    background-color: #f19494;
}
</style>


