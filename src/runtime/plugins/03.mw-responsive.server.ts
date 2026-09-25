import { defineNuxtPlugin, useHead, useState } from '#imports'
import {
  MW_RESPONSIVE_STATE_KEY,
  renderMwResponsiveRules,
  type MwResponsiveRule,
} from '../utils/mwResponsive'

export default defineNuxtPlugin(() => {
  const rules = useState<MwResponsiveRule[]>(
    MW_RESPONSIVE_STATE_KEY,
    () => [],
  )

  useHead(() => ({
    style: rules.value.length
      ? [{
          key: 'mw-responsive',
          innerHTML: renderMwResponsiveRules(rules.value),
          'data-mw-responsive': '',
        }]
      : [],
  }))
})