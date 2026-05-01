import { useEffect, useState } from 'react'
import UnicornScene from 'unicornstudio-react'

export default function HomeBackgroundScene() {
  const [shouldRenderScene, setShouldRenderScene] = useState(true)
  const [isSceneLoaded, setIsSceneLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

    if (mediaQuery.matches || connection?.saveData) {
      setShouldRenderScene(false)
    }

    const handleMotionPreferenceChange = (event) => {
      setShouldRenderScene(!event.matches)
      setIsSceneLoaded(false)
    }

    mediaQuery.addEventListener('change', handleMotionPreferenceChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMotionPreferenceChange)
    }
  }, [])

  return (
    <div className="home-page__background" aria-hidden="true">
      <div className={`home-page__background-fallback${isSceneLoaded ? ' is-scene-ready' : ''}`}>
        <div className="home-page__background-orb home-page__background-orb--one" />
        <div className="home-page__background-orb home-page__background-orb--two" />
        <div className="home-page__background-orb home-page__background-orb--three" />
        <div className="home-page__background-grid" />
      </div>

      {shouldRenderScene ? (
        <UnicornScene
          projectId="7FYe0uLhGpLDIWLGDFns"
          width="100%"
          height="100%"
          scale={1}
          dpi={1}
          fps={30}
          lazyLoad
          production
          ariaLabel="Animated home page background"
          className={`home-page__unicorn-scene${isSceneLoaded ? ' is-visible' : ''}`}
          showPlaceholderOnError={false}
          showPlaceholderWhileLoading={false}
          onLoad={() => {
            setIsSceneLoaded(true)
          }}
          onError={() => {
            setShouldRenderScene(false)
            setIsSceneLoaded(false)
          }}
        />
      ) : null}

      <div className="home-page__background-wash" />
    </div>
  )
}
