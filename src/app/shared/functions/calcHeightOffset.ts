// export const getOffsetHeightForCard = (extra: any = 0) => {
//   let h = 0;
//   let elemList = Array.from(document.getElementsByClassName("ofH_calc_height"));
//   elemList.forEach((x: any) => {
//       let t = x.clientHeight;
//       h += (t ?? 0);
//   })
//   h += extra;
//   return "calc(100vh - " + h + "px)";
// }

export const getOffsetHeightForCard = (extra: number = 0): string => { // For Card
  const totalHeight = getTotalHeight("ofH_calc_nav_bar");

  return `calc(100vh - ${totalHeight + extra}px)`;
};

export const getOffsetHeightForModal = (extra: number = 0): string => { // For Modal
  const totalHeight = getTotalHeight("ofH_calc_modal_header") + getTotalHeight("ofH_calc_modal_footer");

  return `calc(100vh - ${totalHeight + extra}px)`;
};

export const getOffsetHeightForPrimaryTable = (extra: number = 0): string => { // For Primary Table
  const totalHeight = getTotalHeight("ofH_calc_nav_bar") + getTotalHeight("ofH_calc_body_header") + getTotalHeight("ofH_calc_pagin") + getTotalHeight("ofH_calc_mob_global_filter");

  return `calc(100vh - ${totalHeight + extra}px)`;
};

export const getOffsetHeightByCustomClass = (extra: number = 0, customClasses: any[] = []): string => { // For Primary Table
  let totalHeight:number = 0;
  customClasses?.forEach((x:any)=>{
    totalHeight += getTotalHeight(x);
  })

  return `calc(100vh - ${totalHeight + extra}px)`;
};


export const getTotalHeight = (className: string): number => {
  return Array.from(document.getElementsByClassName(className))
    .reduce((sum, elem) => sum + (elem as HTMLElement).clientHeight, 0);
};

