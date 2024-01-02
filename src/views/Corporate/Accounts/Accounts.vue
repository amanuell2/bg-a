<template>
  <div class="space-y-4">
    <Index
      v-if="page == 'index'"
      :corporate="corporate"
      :changePage="changePage"
    ></Index>
    <AddAccount
      v-if="page == 'add'"
      :changePage="changePage"
      :corporate="corporate"
    ></AddAccount>
    <EditAccount
      v-if="page == 'edit'"
      :changePage="changePage"
      :account="account"
    ></EditAccount>
    <ResetPassword
      v-if="page == 'reset-password'"
      :changePage="changePage"
      :account="account"
    ></ResetPassword>
  </div>
</template>

<script>
import Index from "@/views/Corporate/Accounts/Index";
import AddAccount from "@/views/Corporate/Accounts/AddAccount";
import EditAccount from "@/views/Corporate/Accounts/EditAccount";
import ResetPassword from "@/views/Corporate/Accounts/ResetPassword";

export default {
  props: ["corporate"],
  components: { Index, AddAccount, EditAccount, ResetPassword },
  data() {
    return {
      page: "index",
      account: null,
      corporateId: null
    };
  },
  created() {
    if (this.corporate) 
      this.corporateId = this.corporate._id
  },
  methods: {
    changePage(page, account) {
      this.page = page;
      if (account) {
        this.account = account;
      } else {
        this.account = null;
      }
    }
  }
};
</script>
