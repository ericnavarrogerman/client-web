
var application = new Vue({
    el:'#crudApp',
    data:{
     base_url:'http://localhost:8090/',
     allData:'',
     myModel:false,
     actionButton:'Guardar',
     dynamicTitle:'Agregar Nuevo',
     users:[]
    },
    methods:{
     fetchUsers:function(){
      axios
      .request({
        url: this.base_url + 'usuario/getAllUsers',
        method: 'get',
        headers: {
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        }
      })
    .then(function(response){
        application.users = response.data.content;
      });
     },

     fetchAllData:function(){

      axios
          .request({
            url: this.base_url + 'pqr/getAll',
            method: 'get',
            headers: {
                'Authorization': 'Bearer '+window.localStorage.getItem('token')
            }
          })
      .then(function(response){

       application.allData = JSON.parse(window.localStorage.getItem('user')).rol.nombre === 'administrador' 
       ? response.data.content :
        response.data.content.filter(pqr => pqr.usuario.username === 
        JSON.parse(window.localStorage.getItem('user')).username);
      });
     },

     finalizaSesion:function(){
      window.localStorage.clear();
      window.location.href = 'index.html';
     },

     openModel:function(){
        application.asunto = '';
        application.tipo = '';
        application.estado = '';
        application.usuario = '';
        application.fechaCreacion = '';
        application.vigencia = '';
        application.hiddenId = '';
          
        application.actionButton = "Guardar";
        application.dynamicTitle = "Agregar Nuevo";
        application.myModel = true;
     },

     submitData:function(){
      if(application.asunto != '' && application.tipo != '' &&
      application.estado != '' && application.usuario != '' &&
      application.fechaCreacion != ''){
       if(application.actionButton == 'Guardar'){

        axios
        .request({
          url: this.base_url + 'pqr/createPqr',
          method: 'post',
          headers: {
              'Authorization': 'Bearer '+window.localStorage.getItem('token')
          },
          data: {
            asunto: application.asunto,
            tipo: application.tipo,
            estado: application.estado,
            usuario: {
               username:application.usuario
           },
           autor:{
               username: JSON.parse(window.localStorage.getItem('user')).username
           },
            strFechaCreacion: application.fechaCreacion
          }
        })
        .then(function(response){
         application.myModel = false;
         application.fetchAllData();
         application.asunto = '';
         application.tipo = '';
         application.estado = '';
         application.usuario = '';
         application.fechaCreacion = '';
         application.vigencia = '';
         application.hiddenId = '';
         //alert(response.data.message);
         console.log('guardo')
         //console.log(JSON.parse(window.localStorage.getItem('user')))
        });
       }
       if(application.actionButton == 'Actualizar'){

        axios
        .request({
          url: this.base_url + 'pqr/updatePqr',
          method: 'put',
          headers: {
              'Authorization': 'Bearer '+window.localStorage.getItem('token')
          },
          data: {
            asunto: application.asunto,
         tipo: application.tipo,
         estado: application.estado,
         usuario: {
            username:application.usuario
        },
        autor:{
          username: JSON.parse(window.localStorage.getItem('user')).username
        },
         strFechaCreacion: application.fechaCreacion,
         id : application.hiddenId
          }
        })
        .then(function(response){
         application.myModel = false;
         application.fetchAllData();
         application.asunto = '';
         application.tipo = '';
         application.estado = '';
         application.usuario = '';
         application.fechaCreacion = '';
         application.vigencia = '';
         application.hiddenId = '';
         //alert(response.data.message);
         console.log('actualizo')
        });
       }
      }
      else{
       alert("Debes llenar todos los campos");
      }
     },

     fetchData:function(id){
      axios
      .request({
        url: this.base_url + 'pqr/getById?id='+id,
        method: 'get',
        params:{
          id:id
        },
        headers: {
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        }
      })
      .then(function(response){
        application.asunto = response.data.content.asunto;
        application.tipo = response.data.content.tipo;
        application.estado = response.data.content.estado;
        application.usuario = response.data.content.usuario.username;
        application.vigencia = response.data.content.vigencia;
        application.fechaCreacion = response.data.content.fechaCreacion;
       
       application.hiddenId = response.data.content.id;
       application.myModel = true;
       application.actionButton = 'Actualizar';
       application.dynamicTitle = 'Actualizar PQR';
      });
     },

     deleteData:function(id){

      axios
      .request({
        url: this.base_url + 'pqr/deletePqr?id='+id,
        method: 'delete',
        params:{
          id:id
        },
        headers: {
            'Authorization': 'Bearer '+window.localStorage.getItem('token')
        }
      })
      .then(function(response){
        application.fetchAllData();
        //alert(response.data.message);
        console.log('registro eliminado');
       });
      }
    },

    computed:{
      isAdmin:function(){
        return JSON.parse(window.localStorage.getItem('user')).rol.nombre ==='administrador';
      }
    },

    created:function(){
      if(window.localStorage.getItem('user') === null){
        this.finalizaSesion();
      }
     this.fetchAllData();
     this.fetchUsers();
    }
   });