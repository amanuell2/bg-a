
<template>
  <div
    class="box-border w-full h-full p-8 overflow-hidden transition duration-300 ease-in-out border-red-500"
    :class="{ 'border-8 animate-pulse ': newSos }"
  >
    <div
      class="w-full h-full overflow-hidden bg-teal-600 rounded-lg shadow"
      ref="map"
    ></div>
  </div>
</template>

<script>
import init from "@/gmaps";

export default {
  data() {
    return {
      sosList: [],
      google: null,
      markers: [],
      map: null,
      socket: null,
      newSos: null,
    };
  },
  async mounted() {
    this.google = await init();

    this.map = new this.google.maps.Map(this.$refs.map, {
      center: {
        lat: 9.004912,
        lng: 38.778282,
      },
      zoom: 13,
      streetViewControl: false,
      mapTypeControl: false,

    });
  },
  created() {
    this.getDrivers();

    this.$sosSocket.on("sos", () => {
      this.newSos = true;
      setTimeout(() => (this.newSos = false), 6000);

      this.getDrivers();
    });
  },
  methods: {
    getDrivers() {
      this.$http
        .get(`/sos?populate=["driver","passenger","vehicle"]`)
        .then((response) => {
          this.sosList = response.data.data;
          console.log("sos", this.sosList);
          this.addMarkers(this.sosList);
        })
        .catch((err) => console.log(err));
    },
    addMarkers(data) {
      var count = 0;
      var infowindow = new this.google.maps.InfoWindow();
      data.forEach((element) => {
        var lat = element.position.coordinates[1];
        var lng = element.position.coordinates[0];
        console.log(element);
        var icon =
          "https://res.cloudinary.com/torpa/image/upload/w_60,h_60/v1598222724/important-icon-png-26_xte9of.png";

        this.markers[count] = new this.google.maps.Marker({
          position: { lat, lng },
          map: this.map,
          icon: icon,
          // animation: this.google.maps.Animation.BOUNCE,
          title: element.driver.firstName,
        });
        var markerNew = this.markers[count];
        this.google.maps.event.addListener(markerNew, "click", function () {
          var content =
            "<p>Full Name: " +
            element.driver.firstName +
            " " +
            element.driver.lastName +
            "</p>" +
            "<p>Vehicle ID: " +
            element._id +
            "</p>" +
            "<p>Vehicle Model: " +
            element.modelName +
            "</p>" +
            "<p>Color: " +
            element.color +
            "</p>" +
            "<p>type: " +
            element.type +
            "</p>" +
            "<p>Happened AT: " +
            element.createdAt +
            "</p>";

          element.trip
            ? (content +=
                '<p><a href="/rides/' +
                element.trip +
                '/show" target="_balnk" style="color:green; font-size:20px;" >Detail</a></p>')
            : (content += "");

          infowindow.setContent(
            content
            // '<a href="/passengers/'+element.passenger._id+'" target="_balnk" style="color:green; font-size:20px;" >locate Passanger</a>'
          );
          infowindow.open(this.map, markerNew);
          // window.open("/drivers/"+data[count]._id,"_blank","toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=yes, copyhistory=yes");
        });
        count = count + 1;
      });
      count = 0;
    },
  },
};
</script>
