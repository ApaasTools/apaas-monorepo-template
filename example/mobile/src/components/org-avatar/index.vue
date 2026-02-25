<template>
  <div class="org-avatar">
    <img v-if="iconUrl" class="org-icon" :src="iconUrl" alt="">
    <div v-else class="org-icon no-icon">
      {{ computOrgName[0] }}<br />{{ computOrgName[1] }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrgAvatar',
  props: {
    orgName: {
      type: String,
      required: true
    },
    iconUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    computOrgName: function () {
      if (this.orgName) {
        const orgName = this.orgName.slice(0, 4)
        return [orgName.slice(0, 2), orgName.slice(2, 4)]
      }
      return ['', '']
    }
  }
}
</script>

<style lang="scss">
.org-avatar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  .org-icon {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    &.no-icon {
      background-color: $--app-primary-color;
      color: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: $--app-base-font-weight;
      line-height: 18px;
    }
  }
}
</style>
