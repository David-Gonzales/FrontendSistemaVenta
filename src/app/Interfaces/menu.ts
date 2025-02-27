export interface Menu {
  id: number;
  nombre: string;
  icono: string;
  url: string;
  submenus?: Menu[];
  showSubMenu?: boolean;
}
