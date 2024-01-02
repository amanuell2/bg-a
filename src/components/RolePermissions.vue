<template>
    <table class="min-w-full leading-normal">
        <thead>
            <tr>
                <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >Module</th>
                <th
                    class="flex items-center px-5 w-full h-20 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >
                    <input type="checkbox" v-model="selectAll" />
                </th>
            </tr>
        </thead>
        <tbody v-if="rolePermissions" class="relative">
            <tr v-for="(permission, moduleName) in rolePermissions" :key="moduleName">
                <label class="contents" v-if="!moduleName.startsWith('_')">
                    <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p class="whitespace-no-wrap">
                            {{
                                moduleName
                            }}
                        </p>
                    </td>

                    <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <input type="checkbox" v-model="permission.canAccess" :disabled="moduleName === 'rbac'" />
                    </td>
                </label>
            </tr>
            <div
                v-if="loading"
                class="absolute inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-25"
            >
                <i class="text-6xl material-icons spin">sync</i>
                <span class="invisible block">Loading...</span>
            </div>
        </tbody>
        <tbody v-else>
            <tr>
                <td colspan="10" class="py-4 font-semibold text-center text-gray-600 bg-white">
                    <div v-if="loading" class="inline-block">
                        <i class="text-6xl material-icons spin">sync</i>
                        <span class="invisible block">Loading...</span>
                    </div>
                    <div v-else class="inline-block">
                        <i class="text-6xl material-icons">warning</i>
                        <span class="block">No tripRequests!</span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script>
export default {
    props: {
        value: {
            type: Object,
            default: () => ({})
        },
        roleName: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            rolePermissions: {},
            selectAll: false,
        }
    },
    watch: {
        selectAll(newValue) {
            for (const [k] of Object.entries(this.rolePermissions)) {
                if (k.startsWith('_')) continue;
                this.rolePermissions[k].canAccess = newValue;
            }
            this.rolePermissions['rbac'].canAccess = this.roleName === "Super Admin"
        },
        value(newValue) {
            this.rolePermissions = newValue
            this.rolePermissions['rbac'].canAccess = this.roleName === "Super Admin"
        },
        rolePermissions: {
            deep: true,
            handler(newValue) {
                this.$emit('input', newValue)
            }
        }
    },
    created() {
        this.rolePermissions = this.value
    }
}
</script>