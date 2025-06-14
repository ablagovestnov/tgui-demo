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
  SnackbarComponent,
  TelegramService
} from 'tgui-angular';

// Define Telegram WebApp types
interface WebApp {
  isExpanded?: boolean;
  initData?: string;
  initDataUnsafe?: any;
  version?: string;
  platform?: string;
  colorScheme?: string;
  themeParams?: any;
  viewportHeight?: number;
  viewportStableHeight?: number;
  MainButton?: any;
  BackButton?: any;
  ready: () => void;
  expand: () => void;
  close: () => void;
  onEvent: (eventType: string, eventHandler: (...args: any[]) => void) => void;
  offEvent: (eventType: string, eventHandler: (...args: any[]) => void) => void;
  sendData: (data: any) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
}


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
    SnackbarComponent,
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
   
  private telegram = inject(TelegramService);
  
  constructor() {
    // Subscribe to Telegram WebApp readiness
    this.telegram.isReady$.subscribe(isReady => {
      if (isReady) {
        const tg = this.telegram.getTelegramData();
        if (tg) {
          console.log('Telegram WebApp is available 111112222');
          console.log('Color Scheme:', tg.colorScheme);
          console.log('Theme Params:', tg.themeParams);
          
          // Subscribe to events
          tg.onEvent('message', this.handleTelegramMessage);
          tg.onEvent('mainButtonClicked', this.handleMainButtonClick);
          tg.onEvent('viewportChanged', this.handleViewportChange);
          tg.onEvent('themeChanged', () => console.log('Theme changed DEMO'));

        }
      } else {
        console.warn('Telegram WebApp is not available. Are you running this in Telegram?');
      }
    });
  }
  
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

  // Telegram message handlers
  private handleTelegramMessage = () => {
    console.log('Received Telegram message');
    // You can add UI notification here using SnackbarComponent
    const componentRef = this.viewContainerRef.createComponent(SnackbarComponent);
    componentRef.instance.description = 'New message received';
    componentRef.instance.duration = 3000;
    
    setTimeout(() => {
      componentRef.destroy();
    }, 3000);
  };

  private handleMainButtonClick = () => {
    console.log('Main button clicked');
  };

  private handleViewportChange = () => {
    console.log('Viewport changed');
  };

}
