export function getPopupWidth(): string {
    // console.log(window.innerWidth);
    
  if (window.innerWidth < 576) return '95vw';
  if (window.innerWidth < 768) return '80vw';
  if (window.innerWidth < 992) return '60vw';
  return '30vw';
}