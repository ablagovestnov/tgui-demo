import { Component, inject, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  RootComponent, 
  LargeTitleComponent,
  TextComponent,
  SectionComponent,
  ButtonComponent,
  ListComponent,
  InputComponent,
  AvatarComponent,
  BadgeComponent,
  SwitchComponent,
  CellComponent,
  TabbarComponent,
  TabbarItemComponent,
  TguiIcon28Devices,
  TguiIcon28Chat,
  TguiIcon28Stats,
  TguiIcon28Edit,
  ThemeService,
  PlatformService,
  AppearanceType,
  PlatformType
} from 'tgui-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RootComponent, 
    LargeTitleComponent,
    TextComponent,
    SectionComponent,
    ButtonComponent,
    ListComponent,
    InputComponent,
    AvatarComponent,
    BadgeComponent,
    SwitchComponent,
    CellComponent,
    TabbarComponent,
    TabbarItemComponent,
    TguiIcon28Devices,
    TguiIcon28Chat,
    TguiIcon28Stats,
    TguiIcon28Edit
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'TGUI Angular Demo';
  selectedIndex = 0;
  
  // Инжектируем сервисы
  themeService = inject(ThemeService);
  platformService = inject(PlatformService);
  
  // Computed свойства для реактивного отслеживания изменений
  currentAppearance = computed(() => this.themeService.appearance());
  currentPlatform = computed(() => this.platformService.platform());
  
  constructor() {
    // Эффект для отслеживания изменений темы
    effect(() => {
      console.log('Theme changed to:', this.currentAppearance());
    });
    
    // Эффект для отслеживания изменений платформы
    effect(() => {
      console.log('Platform changed to:', this.currentPlatform());
    });
  }
  
  ngOnInit(): void {
    console.log('App initialized');
    console.log('Initial theme:', this.currentAppearance());
    console.log('Initial platform:', this.currentPlatform());
    
    // Инициализируем тему
    this.themeService.setupTheme();
  }
  
  // Переключение темы
  toggleTheme(): void {
    const newTheme: AppearanceType = this.currentAppearance() === 'light' ? 'dark' : 'light';
    console.log('Toggling theme to:', newTheme);
    this.themeService.setTheme(newTheme, false);
  }
  
  // Переключение платформы
  togglePlatform(): void {
    const newPlatform: PlatformType = this.currentPlatform() === 'base' ? 'ios' : 'base';
    console.log('Toggling platform to:', newPlatform);
    this.platformService.setPlatform(newPlatform);
  }
  
  // Геттеры для отображения текущих настроек
  get isDarkTheme(): boolean {
    return this.currentAppearance() === 'dark';
  }
  
  get isIOSPlatform(): boolean {
    return this.currentPlatform() === 'ios';
  }
}
