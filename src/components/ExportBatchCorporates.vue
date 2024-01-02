<template>
  <div>
    <button
      v-if="$store.getters.role && $store.getters.role.permissions['corporate-reports'] && $store.getters.role.permissions['corporate-reports'].canAccess"
      @click="!(downloading || working) ? downloadReport() : () => { }"
      class="p-2 font-semibold bg-white border-2 rounded hover:bg-blue-400 hover:bg-opacity-25 hover:text-blue-600"
    >
      <div v-if="working">
        <i class="flex items-center text-2xl text-center material-icons spin">sync</i>
      </div>
      <div v-else-if="downloading">Exporting...</div>
      <div class="flex gap-2" v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="27.479"
          height="27.136"
          viewBox="0 0 27.479 27.136"
        >
          <path
            id="Union_18"
            data-name="Union 18"
            d="M6029.446-4289.248c-3.915-.647-7.822-1.339-11.732-2.021-.235-.041-.464-.12-.714-.185v-21.11c5.175-.72,10.241-2.011,15.559-2.437v2.418c.376.021.665.05.954.05q3.747,0,7.494,0c.274,0,.549-.006.824,0,1.5.058,1.647.2,1.647,1.678q0,8.729,0,17.458c0,1.511-.176,1.681-1.72,1.684q-4.077.005-8.152,0h-1.022v2.759C6031.482-4289.053,6030.452-4289.081,6029.446-4289.248Zm3.207-3.29h9.972v-19.125h-9.956v1.91h2.324v1.962h-2.327v1.349h2.323v2.026h-2.338v1.288H6035v2.055h-2.345v1.321h2.35v1.984h-2.362v1.344h2.342v1.984h-2.334Zm-7.089-5.152a1,1,0,0,0,.608.537,14.743,14.743,0,0,0,1.855.026c-.739-1.48-1.4-2.885-2.139-4.254a1.528,1.528,0,0,1,.008-1.588c.707-1.349,1.36-2.723,2.076-4.169-.341-.015-.552-.023-.763-.033a1.6,1.6,0,0,0-1.888,1.237,20.684,20.684,0,0,1-.99,2.38c-.384-1.006-.713-1.9-1.079-2.788-.082-.2-.284-.478-.441-.487a18.043,18.043,0,0,0-1.864.071,18.622,18.622,0,0,0,1.064,2.223,3.782,3.782,0,0,1-.08,4.784,15.184,15.184,0,0,0-1.169,2.328,7.88,7.88,0,0,1,1.233.011c.672.123.981-.189,1.2-.776.323-.86.708-1.7,1.072-2.557C6024.707-4299.7,6025.108-4298.682,6025.563-4297.689Zm10.81,3.143v-1.867h4.079v1.867Zm0-3.3v-1.845h4.11v1.845Zm.081-3.278c-.04-.07-.086-.115-.091-.164-.209-1.857-.209-1.858,1.63-1.858h2.477v2.022Zm.37-3.325a.7.7,0,0,1-.478-.465,11.242,11.242,0,0,1-.022-1.511h4.141v2c-.608,0-1.207,0-1.8,0C6038.042-4304.425,6037.43-4304.43,6036.819-4304.451Zm-.451-3.425v-1.875h4.092v1.875Z"
            transform="translate(-6016.5 4315.542)"
            fill="currentColor"
            stroke="rgba(0,0,0,0)"
            stroke-miterlimit="10"
            stroke-width="1"
          />
        </svg>
        Export {{ downloaded ? `(again)` : `as zip` }}
      </div>
      <div></div>
    </button>
    <button v-else class="flex gap-2 p-2 font-semibold text-gray-500 bg-gray-300 border-2 rounded">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27.479"
        height="27.136"
        viewBox="0 0 27.479 27.136"
      >
        <path
          id="Union_18"
          data-name="Union 18"
          d="M6029.446-4289.248c-3.915-.647-7.822-1.339-11.732-2.021-.235-.041-.464-.12-.714-.185v-21.11c5.175-.72,10.241-2.011,15.559-2.437v2.418c.376.021.665.05.954.05q3.747,0,7.494,0c.274,0,.549-.006.824,0,1.5.058,1.647.2,1.647,1.678q0,8.729,0,17.458c0,1.511-.176,1.681-1.72,1.684q-4.077.005-8.152,0h-1.022v2.759C6031.482-4289.053,6030.452-4289.081,6029.446-4289.248Zm3.207-3.29h9.972v-19.125h-9.956v1.91h2.324v1.962h-2.327v1.349h2.323v2.026h-2.338v1.288H6035v2.055h-2.345v1.321h2.35v1.984h-2.362v1.344h2.342v1.984h-2.334Zm-7.089-5.152a1,1,0,0,0,.608.537,14.743,14.743,0,0,0,1.855.026c-.739-1.48-1.4-2.885-2.139-4.254a1.528,1.528,0,0,1,.008-1.588c.707-1.349,1.36-2.723,2.076-4.169-.341-.015-.552-.023-.763-.033a1.6,1.6,0,0,0-1.888,1.237,20.684,20.684,0,0,1-.99,2.38c-.384-1.006-.713-1.9-1.079-2.788-.082-.2-.284-.478-.441-.487a18.043,18.043,0,0,0-1.864.071,18.622,18.622,0,0,0,1.064,2.223,3.782,3.782,0,0,1-.08,4.784,15.184,15.184,0,0,0-1.169,2.328,7.88,7.88,0,0,1,1.233.011c.672.123.981-.189,1.2-.776.323-.86.708-1.7,1.072-2.557C6024.707-4299.7,6025.108-4298.682,6025.563-4297.689Zm10.81,3.143v-1.867h4.079v1.867Zm0-3.3v-1.845h4.11v1.845Zm.081-3.278c-.04-.07-.086-.115-.091-.164-.209-1.857-.209-1.858,1.63-1.858h2.477v2.022Zm.37-3.325a.7.7,0,0,1-.478-.465,11.242,11.242,0,0,1-.022-1.511h4.141v2c-.608,0-1.207,0-1.8,0C6038.042-4304.425,6037.43-4304.43,6036.819-4304.451Zm-.451-3.425v-1.875h4.092v1.875Z"
          transform="translate(-6016.5 4315.542)"
          fill="currentColor"
          stroke="rgba(0,0,0,0)"
          stroke-miterlimit="10"
          stroke-width="1"
        />
      </svg>
      Export Disabled
    </button>
  </div>
</template>
<script>
import { config } from "@/config";
import JSZip from "jszip"

export default {
  props: {
    corporates: {
      type: Array,
      default: () => ([])
    },
    filename: {
      type: String,
      default: `unnamed-batch-report`,
    },
    working: {
      type: Boolean,
    },
    filters: {
      type: Object,
    }
  },
  data() {
    return {
      downloadProgress: 0,
      downloading: false,
      downloaded: false,
      downloadUrl: "reports"
    };
  },
  methods: {
    async downloadReport() {
      this.downloading = true;

      const data = []
      for (const report of this.corporates.filter(({ value }) => value)) {
        try {

          this.$emit('starting', report)

          const result = await this.$misc({
            url: [config.baseURL, report.exportUrl].join("/") + '?' + Object.entries({
              ...Object.fromEntries(
                Object.entries({
                  driver: this.filters.driverId ? this.filters.driverId : undefined,
                  dispatcher: this.filters.userId ? this.filters.userId : undefined,
                  passenger: this.filters.passengerId ? this.filters.passengerId : undefined,
                  ...(this.filters.range || {}),
                }).filter(([key, val]) => key && val)
              ),
            })
              .map(([key, value]) => [key, value].join("="))
              .join("&")

            ,
            method: "GET",
            data: {
              // corporates: this.corporates.map(({ fieldName, value }) => ({ fieldName, value }))
            },
            responseType: "text",
            onDownloadProgress: (progressEvent) => {
              const totalLength = progressEvent.lengthComputable
                ? progressEvent.total
                : progressEvent.target.getResponseHeader("content-length") ||
                progressEvent.target.getResponseHeader(
                  "x-decompressed-content-length"
                );
              if (totalLength !== null) {
                if (this.downloadProgress !== 100) {
                  this.downloading = false;
                  this.$emit('downloading', report)
                }
              }
            },
          })

          console.log("result:", JSON.stringify(result))
          data.push({
            name: report.label,
            content: result.data
          })
          this.$emit('downloaded', report)

        } catch (error) {
          this.$emit('failed', report)

        }

      }


      var zip = new JSZip();
      for (const d of data) {
        zip.file(`${d.name}.csv`, d.content);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        this.filename + '.zip'
      );
      this.downloading = false;
      this.downloaded = true;
      document.body.appendChild(link);
      link.click();

    },
  },
};
</script>