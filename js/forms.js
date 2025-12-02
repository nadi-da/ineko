$(document).ready(function() {
    // Функции для работы с модальными окнами
    const ModalManager = {
        // Открытие модального окна
        openModal: function(modalId) {
            const $modal = $(modalId);
            $modal.fadeIn(300);
            $('body').css('overflow', 'hidden');

            // Фокус на первое поле
            setTimeout(() => {
                $modal.find('input:first').focus();
            }, 100);
        },

        // Закрытие модального окна
        closeModal: function($modal) {
            $modal.addClass('closing');
            setTimeout(() => {
                $modal.removeClass('closing').hide();
                $('body').css('overflow', 'auto');
                ModalManager.resetForm($modal);
            }, 300);
        },

        // Сброс формы
        resetForm: function($modal) {
            const $form = $modal.find('form');
            $form[0].reset();
            $modal.find('.error-message').text('');
            $modal.find('input, textarea').removeClass('error');
            $modal.find('.success-message').hide();
            $modal.find('.submit-btn').prop('disabled', false).show();
        }
    };

    // Инициализация формы "Обратный звонок"
    initCallbackForm();

    // Инициализация формы "Написать нам"
    initWriteUsForm();

    // Общие обработчики для всех модальных окон
    initCommonModalHandlers();

    // Функция инициализации формы "Обратный звонок"
    function initCallbackForm() {
        const $modal = $('#callbackModal');
        const $form = $('#callbackForm');
        const $closeBtn = $modal.find('.close-modal-btn');

        // Открытие модального окна
        $('[data-type="callback-form"]').on('click', function() {
            ModalManager.openModal('#callbackModal');
        });

        // Закрытие по кнопке
        $closeBtn.on('click', function() {
            ModalManager.closeModal($modal);
        });

        // Маска для телефона
        $('#phone').on('input', applyPhoneMask);

        // Обработка отправки формы
        $form.submit(function(e) {
            e.preventDefault();

            if (validateCallbackForm()) {
                submitForm($form, $modal, 'callback');
            }
        });

        // Валидация при потере фокуса
        $form.find('input').on('blur', function() {
            validateCallbackField($(this));
        });

        // Снятие ошибки при начале ввода
        $form.find('input').on('input', function() {
            clearFieldError($(this));
        });
    }

    // Функция инициализации формы "Написать нам"
    function initWriteUsForm() {
        const $modal = $('#writeUsModal');
        const $form = $('#writeUsForm');
        const $closeBtn = $modal.find('.close-modal-btn');

        // Открытие модального окна
        $('[data-type="write-us-form"]').on('click', function() {
            ModalManager.openModal('#writeUsModal');
        });

        // Закрытие по кнопке
        $closeBtn.on('click', function() {
            ModalManager.closeModal($modal);
        });

        // Маска для телефона
        $('#write-phone').on('input', applyPhoneMask);

        // Обработка отправки формы
        $form.submit(function(e) {
            e.preventDefault();

            if (validateWriteUsForm()) {
                submitForm($form, $modal, 'writeus');
            }
        });

        // Валидация при потере фокуса
        $form.find('input, textarea').on('blur', function() {
            validateWriteUsField($(this));
        });

        // Снятие ошибки при начале ввода
        $form.find('input, textarea').on('input', function() {
            clearFieldError($(this));
        });
    }

    // Общие обработчики для всех модальных окон
    function initCommonModalHandlers() {
        // Закрытие по клику вне окна
        $('.modal-overlay').on('click', function(e) {
            if ($(e.target).is(this)) {
                ModalManager.closeModal($(this));
            }
        });

        // Закрытие по ESC
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape') {
                $('.modal-overlay:visible').each(function() {
                    ModalManager.closeModal($(this));
                });
            }
        });
    }

    // Функция маски телефона
    function applyPhoneMask() {
        let value = $(this).val().replace(/\D/g, '');

        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = value.substring(1);
            }

            let formatted = '+7 (';

            if (value.length > 0) {
                formatted += value.substring(0, 3);
            }
            if (value.length > 3) {
                formatted += ') ' + value.substring(3, 6);
            }
            if (value.length > 6) {
                formatted += '-' + value.substring(6, 8);
            }
            if (value.length > 8) {
                formatted += '-' + value.substring(8, 10);
            }

            $(this).val(formatted);
        }
    }

    // Валидация формы "Обратный звонок"
    function validateCallbackForm() {
        let isValid = true;

        const fields = [
            { id: '#name', minLength: 2, error: 'Имя должно содержать минимум 2 символа' },
            { id: '#phone', minDigits: 10, error: 'Введите корректный номер телефона' },
            { id: '#email', type: 'email', error: 'Введите корректный email адрес' }
        ];

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Валидация формы "Написать нам"
    function validateWriteUsForm() {
        let isValid = true;

        const fields = [
            { id: '#write-name', minLength: 2, error: 'Имя должно содержать минимум 2 символа' },
            { id: '#write-phone', minDigits: 10, error: 'Введите корректный номер телефона' },
            { id: '#write-email', type: 'email', error: 'Введите корректный email адрес' },
            { id: '#write-message', minLength: 10, error: 'Сообщение должно содержать минимум 10 символов' }
        ];

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Общая функция валидации поля
    function validateField(fieldConfig) {
        const $field = $(fieldConfig.id);
        const $error = $(fieldConfig.id + '-error');
        const value = $field.val().trim();

        let isValid = true;

        if (fieldConfig.minLength && value.length < fieldConfig.minLength) {
            $error.text(fieldConfig.error);
            $field.addClass('error');
            isValid = false;
        } else if (fieldConfig.minDigits) {
            const digits = value.replace(/\D/g, '');
            if (digits.length < fieldConfig.minDigits) {
                $error.text(fieldConfig.error);
                $field.addClass('error');
                isValid = false;
            }
        } else if (fieldConfig.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                $error.text(fieldConfig.error);
                $field.addClass('error');
                isValid = false;
            }
        }

        if (isValid) {
            $error.text('');
            $field.removeClass('error');
        }

        return isValid;
    }

    // Валидация отдельного поля формы "Обратный звонок"
    function validateCallbackField($field) {
        const fieldId = $field.attr('id');
        const value = $field.val().trim();
        const $error = $('#' + fieldId + '-error');

        switch(fieldId) {
            case 'name':
                if (value.length < 2) {
                    $error.text('Имя должно содержать минимум 2 символа');
                    $field.addClass('error');
                }
                break;

            case 'phone':
                const phoneDigits = value.replace(/\D/g, '');
                if (phoneDigits.length < 10) {
                    $error.text('Введите корректный номер телефона');
                    $field.addClass('error');
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    $error.text('Введите корректный email адрес');
                    $field.addClass('error');
                }
                break;
        }
    }

    // Валидация отдельного поля формы "Написать нам"
    function validateWriteUsField($field) {
        const fieldId = $field.attr('id');
        const value = $field.val().trim();
        const $error = $('#' + fieldId + '-error');

        switch(fieldId) {
            case 'write-name':
                if (value.length < 2) {
                    $error.text('Имя должно содержать минимум 2 символа');
                    $field.addClass('error');
                }
                break;

            case 'write-phone':
                const phoneDigits = value.replace(/\D/g, '');
                if (phoneDigits.length < 10) {
                    $error.text('Введите корректный номер телефона');
                    $field.addClass('error');
                }
                break;

            case 'write-email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    $error.text('Введите корректный email адрес');
                    $field.addClass('error');
                }
                break;

            case 'write-message':
                if (value.length < 10) {
                    $error.text('Сообщение должно содержать минимум 10 символов');
                    $field.addClass('error');
                }
                break;
        }
    }

    // Очистка ошибки поля
    function clearFieldError($field) {
        $field.removeClass('error');
        $('#' + $field.attr('id') + '-error').text('');
    }

    // Отправка формы
    function submitForm($form, $modal, formType) {
        const $submitBtn = $form.find('.submit-btn');
        const $successMessage = $modal.find('.success-message');

        // Блокируем кнопку отправки
        $submitBtn.prop('disabled', true).text('Отправка...');

        // Собираем данные формы
        const formData = {
            formType: formType,
            timestamp: new Date().toISOString()
        };

        $form.find('input, textarea').each(function() {
            formData[$(this).attr('name')] = $(this).val().trim();
        });

        console.log('Отправка данных:', formData);

        // Имитация отправки данных на сервер
        setTimeout(function() {
            // Показываем сообщение об успехе
            $successMessage.fadeIn();
            $submitBtn.hide();

            // Автоматическое закрытие попапа через 3 секунды
            setTimeout(function() {
                ModalManager.closeModal($modal);
            }, 3000);

            // Здесь можно добавить реальный AJAX запрос:
            /*
            $.ajax({
                url: 'submit-form.php',
                type: 'POST',
                data: formData,
                success: function(response) {
                    $successMessage.fadeIn();
                    $submitBtn.hide();

                    setTimeout(function() {
                        ModalManager.closeModal($modal);
                    }, 3000);
                },
                error: function() {
                    alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
                    $submitBtn.prop('disabled', false).text(formType === 'callback' ? 'Заказать звонок' : 'Отправить сообщение');
                }
            });
            */
        }, 1500);
    }
});