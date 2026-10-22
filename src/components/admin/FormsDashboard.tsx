import type { ApplicationForm } from '../../types';
import { formatShortDate } from '../../utils/forms';
import { Icon } from '../Icon';

type FormsDashboardProps = {
  forms: ApplicationForm[];
  filteredForms: ApplicationForm[];
  totalAnswers: number;
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  onViewResponses: (form: ApplicationForm) => void;
  onEditForm: (form: ApplicationForm) => void;
  onDeleteForm: (form: ApplicationForm) => void;
};

export function FormsDashboard({ forms, filteredForms, totalAnswers, search, onSearchChange, onCreate, onViewResponses, onEditForm, onDeleteForm }: FormsDashboardProps) {
  return (
    <>
            <section className='welcome-row'>
              <div>
                <span className='eyebrow'>СРЕДА, 22 ОКТЯБРЯ 2026</span>
                <h1>
                  Хороший день, Мария <span>✳</span>
                </h1>
                <p>Готовы найти кого-то классного? Начните с формы.</p>
              </div>
              <button
                className='button button-primary'
                onClick={() => onCreate()}
              >
                <Icon name='plus' size={18} /> Новая форма
              </button>
            </section>
            <section className='stats-grid'>
              <div className='stat-card'>
                <span className='stat-icon violet'>
                  <Icon name='file' />
                </span>
                <div>
                  <span>Всего форм</span>
                  <strong>{String(forms.length).padStart(2, '0')}</strong>
                </div>
                <span className='stat-foot'>в вашем пространстве</span>
              </div>
              <div className='stat-card'>
                <span className='stat-icon peach'>
                  <Icon name='people' />
                </span>
                <div>
                  <span>Получено откликов</span>
                  <strong>{String(totalAnswers).padStart(2, '0')}</strong>
                </div>
                <span className='stat-foot'>
                  <i className='up-tick'>↑</i> за всё время
                </span>
              </div>
              <div className='stat-card highlight-stat'>
                <span className='stat-icon mint'>
                  <Icon name='sparkle' />
                </span>
                <div>
                  <span>Формы активны</span>
                  <strong>
                    {forms.filter(form => form.published).length}
                    <small> / {forms.length || 0}</small>
                  </strong>
                </div>
                <span className='stat-foot'>
                  <i className='status-dot' /> собирают ответы
                </span>
              </div>
            </section>
            <section className='forms-section'>
              <div className='section-heading'>
                <div>
                  <span className='eyebrow'>ВАША РАБОТА</span>
                  <h2>
                    Мои формы <span className='soft-count'>{forms.length}</span>
                  </h2>
                </div>
                <div className='table-actions'>
                  <label className='search-box'>
                    <span>⌕</span>
                    <input
                      placeholder='Поиск формы'
                      value={search}
                      onChange={event => onSearchChange(event.target.value)}
                    />
                    <kbd>⌘ K</kbd>
                  </label>
                  <button className='filter-button' aria-label='Фильтры'>
                    ☷
                  </button>
                </div>
              </div>
              <div className='form-table'>
                <div className='table-head'>
                  <span>НАЗВАНИЕ</span>
                  <span>СТАТУС</span>
                  <span>ОТКЛИКИ</span>
                  <span>СОЗДАНА</span>
                  <span />
                </div>
                {filteredForms.length ? (
                  filteredForms.map(form => (
                    <div className='table-row' key={form.id}>
                      <button
                        className='form-title-cell'
                        onClick={() => {
                          onViewResponses(form)
                        }}
                      >
                        <span className='form-thumb'>
                          <Icon name='file' size={19} />
                          <i />
                        </span>
                        <span>
                          <strong>{form.title}</strong>
                          <small>{form.description}</small>
                        </span>
                      </button>
                      <div>
                        <span
                          className={
                            form.published
                              ? 'status-badge live'
                              : 'status-badge draft'
                          }
                        >
                          <i />
                          {form.published ? 'Опубликована' : 'Черновик'}
                        </span>
                      </div>
                      <button
                        className='response-count'
                        onClick={() => {
                          onViewResponses(form)
                        }}
                      >
                        <strong>
                          {String(form.responses.length).padStart(2, '0')}
                        </strong>
                        <span>откликов</span>
                        <Icon name='arrow' size={14} />
                      </button>
                      <span className='created-cell'>
                        {formatShortDate(form.createdAt)}
                      </span>
                      <div className='row-actions'>
                        <button
                          className='icon-button'
                          title='Редактировать форму'
                          aria-label={`Редактировать форму «${form.title}»`}
                          onClick={() => onEditForm(form)}
                        >
                          <Icon name='file' size={17} />
                        </button>
                        <button
                          className='icon-button delete-form-button'
                          title='Удалить форму'
                          aria-label={`Удалить форму «${form.title}»`}
                          onClick={() => onDeleteForm(form)}
                        >
                          <Icon name='trash' size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='empty-table'>
                    <div className='empty-icon'>
                      <Icon name='file' size={24} />
                    </div>
                    <strong>
                      {search ? 'Ничего не найдено' : 'Здесь пока пусто'}
                    </strong>
                    <p>
                      {search
                        ? 'Попробуйте изменить запрос.'
                        : 'Создайте форму и поделитесь ссылкой со студентами.'}
                    </p>
                    {!search && (
                      <button
                        className='button button-primary'
                        onClick={() => onCreate()}
                      >
                        <Icon name='plus' size={17} /> Создать форму
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className='table-caption'>
                <span>
                  Показано {filteredForms.length} из {forms.length} форм
                </span>
                <span>
                  Данные хранятся в этом проекте <i>●</i>
                </span>
              </div>
            </section>
            <section className='bottom-note'>
              <span className='note-star'>✳</span>
              <div>
                <strong>
                  Ваша следующая хорошая история начинается здесь.
                </strong>
                <p>
                  Добавьте вопросы, опубликуйте форму и отправьте ссылку нужным
                  людям.
                </p>
              </div>
              <button onClick={() => onCreate()}>
                Создать форму <Icon name='arrow' size={15} />
              </button>
              <span className='note-lines'>✳</span>
            </section>
    </>
  );
}
