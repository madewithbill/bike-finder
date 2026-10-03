// Replaces skeleton loader with loaded image
export function hideSkeleton(key: number) {
  const skeleton = document.getElementById(`${key}`)
  skeleton?.classList.add('hidden')
}
