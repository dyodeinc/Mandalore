import { useEffect } from "react"
import useContextualSaveBar from "../useContextualSaveBar"
import useLoading from "../useLoading"
import useSettings from "../useSettings"
import useToast from "../useToast"
import { useQueryClient } from "react-query"

export default function useCreateSettings(settings, loading = true){
  const queryClient = useQueryClient()
  const [shopSettings, saveSettings] = useSettings({}, {onSuccess: () => queryClient.invalidateQueries('settings')})
  const [setContextualSaveBar, setIsDirty] = useContextualSaveBar()
  const [setToast] = useToast()
  const [setLoading] = useLoading()

  const validateNewSettings = () => {
    const isValid = settings.every(setting => setting.isValid)
    return isValid
  }

  const handleSave = () => {
    const isValid = validateNewSettings()

    if(!isValid){
      setToast({content: 'Invalid Settings', error: true})

      return
    }

    const newSettings = {}
    settings.forEach(setting => {
      newSettings[setting.name] = setting.value
    })

    saveSettings(newSettings)
    setIsDirty(false)
  }

  const handleDiscard = () => {
    resetSettings()
    setIsDirty(false)
  }

  const handleDependencyChange = (isDirty) => {
    if(isDirty && !loading){
      setContextualSaveBar({
        isDirty: true,
        saveAction: {
          onAction: handleSave
        },
        discardAction: {
          onAction: handleDiscard
        }
      })
    }else{
      setContextualSaveBar({ isDirty: false })
    }
  }

  const resetSettings = () => {
    settings.forEach(setting => setting.setter(setting.default))
  }

  useEffect(() => {
    const isDirty = !settings.every(setting => JSON.stringify(setting.value) === JSON.stringify(setting.default))
    handleDependencyChange(isDirty)
  }, settings.map(setting => setting.value))

  useEffect(() => {
    setLoading(loading)
  },[loading])
}