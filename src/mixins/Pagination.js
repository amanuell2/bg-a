const Pagination = {
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      paginator: {
        nextPage: null,
        prevPage: null,
        count: 0,
      },
    };
  },
  computed: {
    start() {
      return this.currentPage * this.perPage - this.perPage + 1;
    },
    end() {
      let end = this.currentPage * this.perPage;
      return end > parseInt(this.paginator.count) ? this.paginator.count : end;
    },
    total() {
      const result = Math.ceil(this.paginator.count / this.perPage);
      return result > 0 ? result : 1;
    },
  },
  created() {
    if (this.$route.query.page) {
      this.currentPage = this.$route.query.page;
    }
    if (this.$route.query.perPage) {
      this.perPage = this.$route.query.perPage;
    }
  },
  watch: {
    $route() {
      if (this.$route.query.page) {
        this.currentPage = this.$route.query.page;
      }
      if (this.$route.query.perPage) {
        this.perPage = this.$route.query.perPage;
      }
      if (parseInt(this.currentPage) > parseInt(this.total)) {
        this.goToPage(this.total)
      }
    },
    total() {
      if (parseInt(this.currentPage) > parseInt(this.total)) {
        this.goToPage(this.total)
      }
    }
  },
  methods: {
    goToPage(page) {
      if (page && !isNaN(page) && page >= 1) {
        this.currentPage = page;
        this.addParamsToLocation({
          page: this.currentPage,
        });
      }
    },
    // goToNext() {
    //   if (this.paginator.nextPage) {
    //     this.currentPage = this.paginator.nextPage;
    //     this.addParamsToLocation({
    //       page: this.currentPage,
    //     });
    //   }
    // },
    // goToPrev() {
    //   if (this.paginator.prevPage) {
    //     this.currentPage = this.paginator.prevPage;
    //   }
    //   this.addParamsToLocation({
    //     page: this.currentPage,
    //     perPage: this.perPage,
    //   });
    // },
    setPerPage(newValue) {
      console.log(newValue)
      this.perPage = newValue;
      this.addParamsToLocation({
        page: this.currentPage,
        perPage: this.perPage,
      });
    },

    async addParamsToLocation(newQueries) {
      const query = { ...Object.assign({}, this.$route.query), ...newQueries };

      await this.$router.push({ query }).catch(() => { });
    },
  },
};

export default Pagination;
