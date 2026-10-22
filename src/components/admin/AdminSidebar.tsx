import { Icon } from '../Icon';

type AdminSidebarProps = {
  page: 'forms' | 'responses';
  activeId: string | null;
  formCount: number;
  totalAnswers: number;
  onNavigate: (page: 'forms' | 'responses') => void;
  onCreate: () => void;
};

export function AdminSidebar({ page, activeId, formCount, totalAnswers, onNavigate, onCreate }: AdminSidebarProps) {
  return (
    <aside className='sidebar'>
        <a className='brand' href='/admin'>
          <span className='brand-mark'>
            <Icon name='sparkle' size={18} />
          </span>
          forme<span className='brand-beta'>BETA</span>
        </a>
        <div className='workspace-label'>РАБОЧЕЕ ПРОСТРАНСТВО</div>
        <div className='workspace-select'>
          <div className='workspace-avatar'>S</div>
          <span>
            <strong>Studio North</strong>
            <small>Личный аккаунт</small>
          </span>
          <span className='chevron'>⌄</span>
        </div>
        <nav className='side-nav'>
          <button
            className={page === 'forms' ? 'nav-item active' : 'nav-item'}
            onClick={() => onNavigate('forms')}
          >
            <Icon name='grid' />
            <span>Обзор</span>
            <kbd>⌘ 1</kbd>
          </button>
          <button
            className={page === 'forms' && !activeId ? 'nav-item active' : 'nav-item'}
            onClick={() => onNavigate('forms')}
          >
            <Icon name='file' />
            <span>Мои формы</span>
            <span className='nav-count'>{formCount}</span>
          </button>
          <button
            className={page === 'responses' ? 'nav-item active' : 'nav-item'}
            onClick={() => onNavigate('responses')}
          >
            <Icon name='people' />
            <span>Отклики</span>
            <span className='nav-count'>{totalAnswers}</span>
          </button>
        </nav>
        <div className='sidebar-bottom'>
          <div className='help-card'>
            <div className='help-spark'>
              <Icon name='sparkle' size={17} />
            </div>
            <strong>
              Меньше рутины.
              <br />
              Больше хороших людей.
            </strong>
            <p>Соберите форму за пару минут и поделитесь ссылкой.</p>
            <button onClick={() => onCreate()}>
              Создать первую форму <span>↗</span>
            </button>
            <span className='help-decoration'>✳</span>
          </div>
          <div className='profile'>
            <div className='profile-avatar'>М</div>
            <div>
              <strong>Мария Смирнова</strong>
              <small>Менеджер</small>
            </div>
            <button className='icon-button' aria-label='Меню профиля'>
              <Icon name='dots' />
            </button>
          </div>
        </div>
    </aside>
  );
}
