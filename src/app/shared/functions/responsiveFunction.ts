export function getPopupWidth(): string {
    console.log(window.innerWidth);
    
  if (window.innerWidth < 576) return '95vw';       // extra small screens
  if (window.innerWidth < 768) return '80vw';       // small devices
  if (window.innerWidth < 992) return '60vw';       // tablets
  return '30vw';                                     // desktop default
}