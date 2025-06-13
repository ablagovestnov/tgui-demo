import { Component, inject, computed, OnInit, signal, ViewContainerRef } from '@angular/core';
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
  TguiIcon28Chat,
  TguiIcon28Stats,
  TguiIcon28Edit,
  TguiIcon28Heart,
  TguiIcon28Archive,
  ThemeService,
  PlatformService,
  AppearanceType,
  PlatformType,
  AvatarBadgeComponent,
  AvatarAcronymComponent,
  TappableComponent,
  TguiIcon16Cancel,
  TguiDynamicIconComponent,
  ProgressComponent,
  CardComponent,
  SnackbarComponent
} from 'tgui-angular';

interface ShowcaseCard {
  icon: string;
  iconClass: string;
  title: string;
  subtitle?: string;
  badge?: {
    type: 'number';
    value: string | number;
  };
  progress?: number;
  action: {
    text: string;
    type: string;
  };
}

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
    AvatarBadgeComponent,
    BadgeComponent,
    SwitchComponent,
    CellComponent,
    TabbarComponent,
    TabbarItemComponent,
    TguiIcon28Chat,
    TguiIcon28Stats,
    TguiIcon28Edit,
    TguiIcon28Heart,
    TguiIcon28Archive,
    TappableComponent,
    TguiIcon16Cancel,
    TguiDynamicIconComponent,
    ProgressComponent,
    CardComponent,
    SnackbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'TGUI Angular Demo';
  selectedIndex = 0;  // Starting with Showcase tab
  
  // Showcase cards data
  showcaseCards: ShowcaseCard[] = [
    {
      icon: 'heart',
      iconClass: 'premium',
      title: 'Premium',
      badge: {
        type: 'number',
        value: 'PRO'
      },
      action: {
        text: 'Try Premium',
        type: 'Premium'
      }
    },
    {
      icon: 'chat',
      iconClass: 'messages',
      title: 'Messages',
      subtitle: '5 unread',
      badge: {
        type: 'number',
        value: 5
      },
      action: {
        text: 'Open Chat',
        type: 'Messages'
      }
    },
    {
      icon: 'archive',
      iconClass: 'achievements',
      title: 'Achievements',
      progress: 75,
      action: {
        text: 'View All',
        type: 'Achievements'
      }
    }
  ];
  
  // Input handling
  value = signal('');
  
  // Инжектируем сервисы
  themeService = inject(ThemeService);
  platformService = inject(PlatformService);
  
  // Computed свойства для реактивного отслеживания изменений
  currentPlatform = computed(() => this.platformService.platform());
  currentAppearance = computed(() => this.themeService.appearance());
  
  private viewContainerRef = inject(ViewContainerRef);
  private activeSnackbar?: { component: any; timeout: any };
  
  constructor() {}
  
  ngOnInit(): void {
    // Инициализируем тему
    this.themeService.setupTheme();
  }
  
  // Обработчик смены вкладки
  onTabChange(index: number): void {
    this.selectedIndex = index;
  }

  // Input handlers
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
  }

  clearInput(): void {
    this.value.set('');
  }

  // Showcase handlers
  showNotification(type: string): void {
    // Clear existing snackbar if any
    if (this.activeSnackbar) {
      clearTimeout(this.activeSnackbar.timeout);
      this.activeSnackbar.component.destroy();
    }

    // Create new snackbar
    const componentRef = this.viewContainerRef.createComponent(SnackbarComponent);
    componentRef.instance.duration = 3000;
    
    switch (type) {
      case 'Premium':
        componentRef.instance.description = 'Try our premium features!';
        break;
      case 'Messages':
        componentRef.instance.description = 'You have 5 unread messages';
        break;
      case 'Achievements':
        componentRef.instance.description = 'Check out your achievements progress';
        break;
      default:
        componentRef.instance.description = 'Notification';
    }

    // Set up auto-close
    const timeout = setTimeout(() => {
      componentRef.destroy();
      this.activeSnackbar = undefined;
    }, componentRef.instance.duration);

    // Store reference to active snackbar
    this.activeSnackbar = {
      component: componentRef,
      timeout
    };
  }

  showShareOptions(): void {
    console.log('Share options clicked');
  }
}
