(function() {
    // Внутрішній стан розкладу
    let stateSchType = 'class';
    let stateSchWeek = 'week1';
    let stateSchDay = 'ПН';

    const emptyWeek = () => ({ "ПН": [], "ВТ": [], "СР": [], "ЧТ": [], "ПТ": [] });
    const L = (n, t, s, tr, r) => ({ num: n, time: t, subject: s, teacher: tr, room: r });
    const dupW = (w) => ({ week1: w, week2: JSON.parse(JSON.stringify(w)) });

    // Час уроків (Різні зміни та формати)
    const t1_1="08:00 – 08:35", t2_1="08:50 – 09:25", t3_1="09:40 – 10:15", t4_1="10:25 – 11:00", t5_1="11:10 – 11:45";
    const t1_2="08:00 – 08:40", t2_2="08:50 – 09:30", t3_2="09:40 – 10:20", t4_2="10:30 – 11:10", t5_2="11:20 – 12:00";
    const t1_3="12:10 – 12:50", t2_3="13:00 – 13:40", t3_3="13:50 – 14:30", t4_3="14:40 – 15:20", t5_3="15:30 – 16:10", t6_3="16:20 – 17:00";
    const t0_4="12:35 – 13:20", t1_4="13:30 – 14:15", t2_4="14:25 – 15:10", t3_4="15:20 – 16:05", t4_4="16:15 – 17:00", t5_4="17:10 – 17:55", t6_4="18:05 – 18:50";
    const t1_5="08:00 – 08:45", t2_5="08:55 – 09:40", t3_5="09:50 – 10:35", t4_5="10:45 – 11:30", t5_5="11:40 – 12:25", t6_5="12:35 – 13:20", t7_5="13:30 – 14:15";

    // Предмети
    const U="Українська мова", M="Математика", E="Англійська мова", PE="Фізична культура", Y="Я досліджую світ", L_subj="Літературне читання", D="Дизайн і технології", A="Мистецтво", I="Інформатика", ULit="Українська література", Nat="Пізнаємо природу", Dram="Драматургія і театр", Zar="Зарубіжна література", Zdor="Здоров'я, безпека та добробут", Hist="Досліджуємо історію і суспільство", Tech="Технології", Pol="Польська мова", Eth="Етика", Geo="Географія", Grom="Громадянська освіта", Alg="Алгебра", Biol="Біологія", Chem="Хімія", HistU="Історія України", Geom="Геометрія", Phys="Фізика", STEM="STEM", Pidpr="Підприємництво і фінансова грамотність", Ozn="Основи здоров'я", HistW="Всесвітня історія", Prav="Правознавство", Nim="Німецька Мова", Astr="Астрономія", Zakh="Захист України";
    
    // Вчителі
    const F="Флячинська О.М.", Bel="Бєлова Т.Л.", NazL="Назарчук Л.Ю.", Shat="Шатківська О.Б.", Yevt="Євтушенко Т.С.", Tar="Тарасенко А.С.", Gosp="Господарик О.І.", Bovs="Бовсуновський Ю.М.", NazI="Назарчук І.А.", BelYevt="Бєлова Т.Л. / Євтушенко Т.С.", VilNazI="Вільчинська І.Л. / Назарчук І.А.", Strem="Стременко К.А.", StremVil="Стременко К.А. / Вільчинська І.Л.", Stol="Столяр І.С.", StolVil="Столяр І.С. / Вільчинська І.Л.", Klym="Климчук О.Л.", VilKlym="Вільчинська І.Л. / Климчук О.Л.", March="Марченко С.В.", MarchVil="Марченко С.В. / Вільчинська І.Л.", Zhel="Желяк Л.В.", ZhelVil="Желяк Л.В. / Вільчинська І.Л.", Maks="Максимець Н.Ф.", Yakus="Якусевич Н.В.", Opan="Опанчук М.І.", Amr="Амрахова І.В.", Serg="Сергєєва І.М.", Myh="Михайлицька О.С.", Vakh="Ваховська Н.С.", ZhemVil="Жембровський О.О. / Вільчинська І.Л.", Kat="Катріч Л.О.", Osyp="Осипенко С.С.", Lad="Ладнюк О.В.", Sav="Савчук І.В.", Kuzn="Кузнецова О.В.", Did="Дідко І.С.", Maksym="Максимчук Л.П.", Greb="Гребенюк І.Д.", Yarosh="Ярошенко Н.М.", Koz="Козел Т.Ю.", Paz="Пазич І.С.", Kob="Кобернік Д.І.", Ukr="Українець Л.О.", Pust="Пустохіна Є.Ф.", ZhemVakh="Жембровський О.О. / Ваховська Н.С.", VakhYevt="Ваховська Н.С. / Євтушенко Т.С.", Danil="Данілова С.В.", Dudar="Дудар О.В.", Gorosh="Горощенко А.М.", Yarmol="Ярмоліцька Н.Ю.", Atam="Атаманчук О.Є.", Koval="Ковальчук В.В.", Kochev="Кочевенко Д.М.", Rysich="Рисіч Т.І.", Probot="Проботюк А.О.", Sarancha="Саранча М.П.", Lavr="Лавриненко Н.В.", ProbotO="Проботюк О.Д.", PustV="Пустохіна В.І.", Manokhin="Манохін В.В.", ProZhem="Проботюк А.О. / Жембровський О.О.", VakhKuzn="Ваховська Н.С. / Кузнецова О.В.", OsypYarosh="Осипенко С.С. / Ярошенко Н.М.", PustVPustE="Пустохіна Є.Ф. / Пустохіна В.І.", ProbotVil="Проботюк А.О. / Вільчинська І.Л.";
    
    // Аудиторії
    const r4="4 ауд.", r2="2 ауд.", r24="24 ауд.", r23="23 ауд.", r22="22 ауд.", r20="20 ауд.", rGym="Спортивна зала", r26_20="26 / 20 ауд.", r20_26="20 / 26 ауд.", r5="5 ауд.", r39="39 ауд.", rAct="Актова зала", rMyst="Майстерня", r37="37 ауд.", r36="36 ауд.", rOnl="Онлайн", r25="25 ауд.", r33_34="33 / 34 ауд.", r41="41 ауд.", r40="40 ауд.", r26="26 ауд.", r34="34 ауд.", rZakh="Кабінет Захисту України", r39_25="39 / 25 ауд.", r25_40="25 / 40 ауд.", r25_Myst="Майстерня / 25 ауд.", r33="33 ауд.", r30="30 ауд.", r35="35 ауд.";

    window.MY_REAL_SCHEDULE = {
        class: {
            "1-А": dupW({
                "ПН": [L(1,t1_1,U,F,r4), L(2,t2_1,M,F,r4), L(3,t3_1,U,F,r4), L(4,t4_1,Y,F,r4)],
                "ВТ": [L(1,t1_1,E,Bel,r4), L(2,t2_1,M,F,r4), L(3,t3_1,Y,F,r4), L(4,t4_1,PE,F,rGym), L(5,t5_1,D,F,r4)],
                "СР": [L(1,t1_1,U,F,r4), L(2,t2_1,M,F,r4), L(3,t3_1,U,F,r4), L(4,t4_1,Y,F,r4)],
                "ЧТ": [L(1,t1_1,U,F,r4), L(2,t2_1,M,F,r4), L(3,t3_1,U,F,r4), L(4,t4_1,PE,F,rGym)],
                "ПТ": [L(1,t1_1,U,F,r4), L(2,t2_1,E,Bel,r4), L(3,t3_1,A,F,r4), L(4,t4_1,PE,F,rGym)]
            }),
            "1-Б": dupW({
                "ПН": [L(1,t1_1,U,NazL,r2), L(2,t2_1,U,NazL,r2), L(3,t3_1,M,NazL,r2), L(4,t4_1,PE,NazL,rGym)],
                "ВТ": [L(1,t1_1,U,NazL,r2), L(2,t2_1,E,Bel,r2), L(3,t3_1,M,NazL,r2), L(4,t4_1,Y,NazL,r2), L(5,t5_1,Y,NazL,r2)],
                "СР": [L(1,t1_1,U,NazL,r2), L(2,t2_1,U,NazL,r2), L(3,t3_1,M,NazL,r2), L(4,t4_1,PE,NazL,rGym)],
                "ЧТ": [L(1,t1_1,U,NazL,r2), L(2,t2_1,M,NazL,r2), L(3,t3_1,Y,NazL,r2), L(4,t4_1,PE,NazL,rGym)],
                "ПТ": [L(1,t1_1,E,Bel,r2), L(2,t2_1,U,NazL,r2), L(3,t3_1,D,NazL,r2), L(4,t4_1,A,NazL,r2)]
            }),
            "1-В": dupW({
                "ПН": [L(1,t1_1,Y,Shat,r24), L(2,t2_1,U,Shat,r24), L(3,t3_1,E,Yevt,r24), L(4,t4_1,PE,Shat,rGym)],
                "ВТ": [L(1,t1_1,Y,Shat,r24), L(2,t2_1,U,Shat,r24), L(3,t3_1,M,Shat,r24), L(4,t4_1,U,Shat,r24), L(5,t5_1,PE,Shat,rGym)],
                "СР": [L(1,t1_1,U,Shat,r24), L(2,t2_1,M,Shat,r24), L(3,t3_1,U,Shat,r24), L(4,t4_1,Y,Shat,r24)],
                "ЧТ": [L(1,t1_1,U,Shat,r24), L(2,t2_1,M,Shat,r24), L(3,t3_1,PE,Shat,rGym), L(4,t4_1,D,Shat,r24)],
                "ПТ": [L(1,t1_1,M,Shat,r24), L(2,t2_1,E,Yevt,r24), L(3,t3_1,U,Shat,r24), L(4,t4_1,A,Shat,r24)]
            }),
            "2-А": dupW({
                "ПН": [L(1,t1_2,M,Tar,r23), L(2,t2_2,E,Yevt,r23), L(3,t3_2,PE,Tar,rGym), L(4,t4_2,U,Tar,r23), L(5,t5_2,L_subj,Tar,r23)],
                "ВТ": [L(1,t1_2,U,Tar,r23), L(2,t2_2,M,Tar,r23), L(3,t3_2,Y,Tar,r23), L(4,t4_2,I,Tar,r20), L(5,t5_2,L_subj,Tar,r23)],
                "СР": [L(1,t1_2,U,Tar,r23), L(2,t2_2,M,Tar,r23), L(3,t3_2,PE,Tar,rGym), L(4,t4_2,L_subj,Tar,r23), L(5,t5_2,Y,Tar,r23)],
                "ЧТ": [L(1,t1_2,U,Tar,r23), L(2,t2_2,M,Tar,r23), L(3,t3_2,E,Yevt,r23), L(4,t4_2,D,Tar,r23)],
                "ПТ": [L(1,t1_2,Y,Tar,r23), L(2,t2_2,A,Tar,r23), L(3,t3_2,E,Yevt,r23), L(4,t4_2,PE,Tar,rGym)]
            }),
            "2-Б": dupW({
                "ПН": [L(1,t1_2,E,Bel,r22), L(2,t2_2,M,Gosp,r22), L(3,t3_2,U,Gosp,r22), L(4,t4_2,Y,Gosp,r22), L(5,t5_2,PE,Bovs,rGym)],
                "ВТ": [L(1,t1_2,U,Gosp,r22), L(2,t2_2,I,Gosp,r22), L(3,t3_2,M,Gosp,r22), L(4,t4_2,L_subj,Gosp,r22), L(5,t5_2,D,Gosp,r22)],
                "СР": [L(1,t1_2,U,Gosp,r22), L(2,t2_2,E,Bel,r22), L(3,t3_2,M,Gosp,r22), L(4,t4_2,PE,Bovs,rGym), L(5,t5_2,Y,Gosp,r22)],
                "ЧТ": [L(1,t1_2,E,Bel,r22), L(2,t2_2,M,Gosp,r22), L(3,t3_2,L_subj,Gosp,r22), L(4,t4_2,PE,Bovs,rGym)],
                "ПТ": [L(1,t1_2,U,Gosp,r22), L(2,t2_2,L_subj,Gosp,r22), L(3,t3_2,Y,Gosp,r22), L(4,t4_2,A,Gosp,r22)]
            }),
            "2-В": dupW({
                "ПН": [L(1,t1_2,E,Bel,r22), L(2,t2_2,M,Gosp,r22), L(3,t3_2,U,Gosp,r22), L(4,t4_2,Y,Gosp,r22), L(5,t5_2,PE,Bovs,rGym)],
                "ВТ": [L(1,t1_2,U,Gosp,r22), L(2,t2_2,I,Gosp,r22), L(3,t3_2,M,Gosp,r22), L(4,t4_2,L_subj,Gosp,r22), L(5,t5_2,D,Gosp,r22)],
                "СР": [L(1,t1_2,U,Gosp,r22), L(2,t2_2,E,Bel,r22), L(3,t3_2,M,Gosp,r22), L(4,t4_2,PE,Bovs,rGym), L(5,t5_2,Y,Gosp,r22)],
                "ЧТ": [L(1,t1_2,E,Bel,r22), L(2,t2_2,M,Gosp,r22), L(3,t3_2,L_subj,Gosp,r22), L(4,t4_2,PE,Bovs,rGym)],
                "ПТ": [L(1,t1_2,U,Gosp,r22), L(2,t2_2,L_subj,Gosp,r22), L(3,t3_2,Y,Gosp,r22), L(4,t4_2,A,Gosp,r22)]
            }),
            "3-А": dupW({
                "ПН": [L(1,t1_3,U,NazI,r2), L(2,t2_3,M,NazI,r2), L(3,t3_3,E,BelYevt,r2), L(4,t4_3,L_subj,NazI,r2), L(5,t5_3,PE,NazI,rGym)],
                "ВТ": [L(1,t1_3,U,NazI,r2), L(2,t2_3,M,NazI,r2), L(3,t3_3,L_subj,NazI,r2), L(4,t4_3,Y,NazI,r2), L(5,t5_3,Y,NazI,r2)],
                "СР": [L(1,t1_3,E,BelYevt,r2), L(2,t2_3,U,NazI,r2), L(3,t3_3,M,NazI,r2), L(4,t4_3,L_subj,NazI,r2), L(5,t5_3,PE,NazI,rGym)],
                "ЧТ": [L(1,t1_3,U,NazI,r2), L(2,t2_3,M,NazI,r2), L(3,t3_3,Y,NazI,r2), L(4,t4_3,I,VilNazI,r26_20), L(5,t5_3,PE,NazI,rGym)],
                "ПТ": [L(1,t1_3,E,BelYevt,r2), L(2,t2_3,M,NazI,r2), L(3,t3_3,D,NazI,r2), L(4,t4_3,A,NazI,r2)]
            }),
            "3-Б": dupW({
                "ПН": [L(1,t1_3,U,Strem,r4), L(2,t2_3,M,Strem,r4), L(3,t3_3,L_subj,Strem,r4), L(4,t4_3,E,Yevt,r4), L(5,t5_3,PE,Strem,rGym)],
                "ВТ": [L(1,t1_3,U,Strem,r4), L(2,t2_3,M,Strem,r4), L(3,t3_3,Y,Strem,r4), L(4,t4_3,L_subj,Strem,r4), L(5,t5_3,PE,Strem,rGym)],
                "СР": [L(1,t1_3,M,Strem,r4), L(2,t2_3,Y,Strem,r4), L(3,t3_3,E,Yevt,r4), L(4,t4_3,U,Strem,r4), L(5,t5_3,A,Strem,r4)],
                "ЧТ": [L(1,t1_3,U,Strem,r4), L(2,t2_3,M,Strem,r4), L(3,t3_3,Y,Strem,r4), L(4,t4_3,L_subj,Strem,r4)],
                "ПТ": [L(1,t1_3,I,StremVil,r20_26), L(2,t2_3,M,Strem,r4), L(3,t3_3,PE,Strem,rGym), L(4,t4_3,D,Strem,r4), L(5,t5_3,E,Yevt,r4)]
            }),
            "3-В": dupW({
                "ПН": [L(1,t1_3,U,Stol,r24), L(2,t2_3,E,Yevt,r24), L(3,t3_3,M,Stol,r24), L(4,t4_3,PE,Stol,rGym), L(5,t5_3,Y,Stol,r24)],
                "ВТ": [L(1,t1_3,L_subj,Stol,r24), L(2,t2_3,U,Stol,r24), L(3,t3_3,M,Stol,r24), L(4,t4_3,Y,Stol,r24), L(5,t5_3,D,Stol,r24)],
                "СР": [L(1,t1_3,L_subj,Stol,r24), L(2,t2_3,E,Yevt,r24), L(3,t3_3,U,Stol,r24), L(4,t4_3,M,Stol,r24), L(5,t5_3,A,Stol,r24)],
                "ЧТ": [L(1,t1_3,M,Stol,r24), L(2,t2_3,U,Stol,r24), L(3,t3_3,PE,Stol,rGym), L(4,t4_3,E,Yevt,r24), L(5,t5_3,I,StolVil,r20_26)],
                "ПТ": [L(1,t1_3,Y,Stol,r24), L(2,t2_3,L_subj,Stol,r24), L(3,t3_3,M,Stol,r24), L(4,t4_3,PE,Stol,rGym)]
            }),
            "4-А": dupW({
                "ПН": [L(1,t1_3,PE,Bovs,rGym), L(2,t2_3,M,Klym,r22), L(3,t3_3,U,Klym,r22), L(4,t4_3,E,Bel,r22), L(5,t5_3,A,Klym,r22)],
                "ВТ": [L(1,t1_3,L_subj,Klym,r22), L(2,t2_3,M,Klym,r22), L(3,t3_3,U,Klym,r22), L(4,t4_3,Y,Klym,r22), L(5,t5_3,Y,Klym,r22)],
                "СР": [L(1,t1_3,M,Klym,r22), L(2,t2_3,PE,Bovs,rGym), L(3,t3_3,E,Bel,r22), L(4,t4_3,L_subj,Klym,r22), L(5,t5_3,D,Klym,r22)],
                "ЧТ": [L(1,t1_3,M,Klym,r22), L(2,t2_3,PE,Bovs,rGym), L(3,t3_3,E,Bel,r22), L(4,t4_3,U,Klym,r22), L(5,t5_3,Y,Klym,r22)],
                "ПТ": [L(1,t1_3,U,Klym,r22), L(2,t2_3,I,VilKlym,r26_20), L(3,t3_3,M,Klym,r22), L(4,t4_3,L_subj,Klym,r22)]
            }),
            "4-Б": dupW({
                "ПН": [L(1,t1_3,E,BelYevt,r5), L(2,t2_3,M,March,r5), L(3,t3_3,L_subj,March,r5), L(4,t4_3,Y,March,r5), L(5,t5_3,D,March,r5)],
                "ВТ": [L(1,t1_3,E,BelYevt,r5), L(2,t2_3,M,March,r5), L(3,t3_3,U,March,r5), L(4,t4_3,PE,March,rGym)],
                "СР": [L(1,t1_3,U,March,r5), L(2,t2_3,M,March,r5), L(3,t3_3,PE,March,rGym), L(4,t4_3,Y,March,r5), L(5,t5_3,A,March,r5), L(6,t6_3,I,MarchVil,r20_26)],
                "ЧТ": [L(1,t1_3,E,BelYevt,r5), L(2,t2_3,M,March,r5), L(3,t3_3,U,March,r5), L(4,t4_3,L_subj,March,r5), L(5,t5_3,PE,March,rGym)],
                "ПТ": [L(1,t1_3,U,March,r5), L(2,t2_3,M,March,r5), L(3,t3_3,L_subj,March,r5), L(4,t4_3,Y,March,r5)]
            }),
            "4-В": dupW({
                "ПН": [L(1,t1_3,U,Zhel,r23), L(2,t2_3,E,Bel,r23), L(3,t3_3,M,Zhel,r23), L(4,t4_3,L_subj,Zhel,r23), L(5,t5_3,PE,Zhel,rGym)],
                "ВТ": [L(1,t1_3,U,Zhel,r23), L(2,t2_3,M,Zhel,r23), L(3,t3_3,Y,Zhel,r23), L(4,t4_3,D,Zhel,r23), L(5,t5_3,PE,Zhel,rGym)],
                "СР": [L(1,t1_3,L_subj,Zhel,r23), L(2,t2_3,E,Bel,r23), L(3,t3_3,M,Zhel,r23), L(4,t4_3,U,Zhel,r23)],
                "ЧТ": [L(1,t1_3,U,Zhel,r23), L(2,t2_3,E,Bel,r23), L(3,t3_3,M,Zhel,r23), L(4,t4_3,Y,Zhel,r23), L(5,t5_3,A,Zhel,r23), L(6,t6_3,I,ZhelVil,r26_20)],
                "ПТ": [L(1,t1_3,M,Zhel,r23), L(2,t2_3,L_subj,Zhel,r23), L(3,t3_3,Y,Zhel,r23), L(4,t4_3,PE,Zhel,rGym)]
            }),
            "5-А": dupW({
                "ПН": [L(1,t1_4,ULit,Maks,r39), L(2,t2_4,M,Yakus,r39), L(3,t3_4,PE,Opan,rGym), L(4,t4_4,Nat,Amr,r39), L(5,t5_4,U,Maks,r39)],
                "ВТ": [L(1,t1_4,U,Maks,r39), L(2,t2_4,A,Serg,r39), L(3,t3_4,M,Yakus,r39), L(4,t4_4,Dram,Myh,rAct), L(5,t5_4,Nat,Amr,r39), L(6,t6_4,E,Vakh,r39)],
                "СР": [L(1,t1_4,M,Yakus,r39), L(2,t2_4,I,ZhemVil,r26_20), L(3,t3_4,Zar,Serg,r39), L(4,t4_4,U,Maks,r39), L(5,t5_4,PE,Opan,rGym), L(6,t6_4,E,Vakh,r39)],
                "ЧТ": [L(1,t1_4,Zar,Serg,r39), L(2,t2_4,U,Maks,r39), L(3,t3_4,E,Vakh,r39), L(4,t4_4,M,Yakus,r39), L(5,t5_4,Zdor,Amr,r39), L(6,t6_4,Tech,Osyp,rMyst)],
                "ПТ": [L(1,t1_4,E,Vakh,r39), L(2,t2_4,PE,Opan,rGym), L(3,t3_4,M,Yakus,r39), L(4,t4_4,Hist,Kat,r39), L(5,t5_4,ULit,Maks,r39)]
            }),
            "5-Б": dupW({
                "ПН": [L(1,t1_4,Pol,Lad,r37), L(2,t2_4,M,Sav,r37), L(3,t3_4,Nat,Amr,r37), L(4,t4_4,U,Maks,r37), L(5,t5_4,PE,Opan,rGym), L(6,t6_4,ULit,Maks,r37)],
                "ВТ": [L(1,t1_4,M,Sav,r37), L(2,t2_4,E,Kuzn,r37), L(3,t3_4,A,Serg,r37), L(4,t4_4,U,Maks,r37), L(5,t5_4,Dram,Myh,rAct), L(6,t6_4,Nat,Amr,r37)],
                "СР": [L(1,t1_4,M,Sav,r37), L(2,t2_4,Eth,Serg,r37), L(3,t3_4,PE,Opan,rGym), L(4,t4_4,E,Kuzn,r37), L(5,t5_4,U,Maks,r37), L(6,t6_4,I,ZhemVil,r20_26)],
                "ЧТ": [L(1,t1_4,E,Kuzn,r37), L(2,t2_4,M,Sav,r37), L(3,t3_4,U,Maks,r37), L(4,t4_4,Zar,Serg,r37), L(5,t5_4,Tech,Osyp,rMyst)],
                "ПТ": [L(1,t1_4,M,Sav,r37), L(2,t2_4,E,Kuzn,r37), L(3,t3_4,Hist,Kat,r37), L(4,t4_4,ULit,Maks,r37), L(5,t5_4,Pol,Lad,r37), L(6,t6_4,PE,Opan,rGym)]
            }),
            "5-В": dupW({
                "ПН": [L(1,t1_4,ULit,Did,r36), L(2,t2_4,M,Maksym,r36), L(3,t3_4,U,Did,r36), L(4,t4_4,PE,Opan,rGym), L(5,t5_4,Nat,Amr,r36)],
                "ВТ": [L(1,t1_4,A,Serg,r36), L(2,t2_4,U,Did,r36), L(3,t3_4,M,Maksym,r36), L(4,t4_4,Nat,Amr,r36), L(5,t5_4,E,Greb,r36), L(6,t6_4,Dram,Myh,rAct)],
                "СР": [L(1,t1_4,M,Maksym,r36), L(2,t2_4,U,Did,r36), L(3,t3_4,I,ZhemVil,r20_26), L(4,t4_4,PE,Opan,rGym), L(5,t5_4,E,Greb,r36), L(6,t6_4,Tech,Yarosh,r36)],
                "ЧТ": [L(1,t1_4,M,Maksym,r36), L(2,t2_4,U,Did,r36), L(3,t3_4,Zar,Yarosh,r36), L(4,t4_4,Zdor,Amr,r36), L(5,t5_4,E,Greb,r36), L(6,t6_4,Zar,Yarosh,r36)],
                "ПТ": [L(1,t1_4,ULit,Did,r36), L(2,t2_4,M,Maksym,r36), L(3,t3_4,E,Greb,r36), L(4,t4_4,PE,Opan,rGym), L(5,t5_4,Hist,Kat,r36)]
            }),
            "6-А": {
                week1: {
                    "ПН": [L(1,t1_4,Eth,Serg,rOnl), L(2,t2_4,U,Koz,rOnl), L(3,t3_4,A,Serg,rOnl), L(4,t4_4,M,Maksym,rOnl), L(5,t5_4,Hist,Kat,rOnl), L(6,t6_4,PE,Opan,rOnl)],
                    "ВТ": [L(0,t0_4,Geo,Kob,rOnl), L(1,t1_4,M,Maksym,rOnl), L(2,t2_4,U,Koz,rOnl), L(3,t3_4,ULit,Koz,rOnl), L(4,t4_4,PE,Opan,rOnl), L(5,t5_4,E,Vakh,rOnl), L(6,t6_4,Grom,Kat,rOnl)],
                    "СР": [L(0,t0_4,Pol,Lad,rOnl), L(1,t1_4,ULit,Koz,rOnl), L(2,t2_4,M,Maksym,rOnl), L(3,t3_4,U,Koz,rOnl), L(4,t4_4,Hist,Kat,rOnl), L(5,t5_4,E,Vakh,rOnl), L(6,t6_4,Geo,Kob,rOnl)],
                    "ЧТ": [L(0,t0_4,Nat,Paz,rOnl), L(1,t1_4,U,Koz,rOnl), L(2,t2_4,Zar,Serg,rOnl), L(3,t3_4,M,Maksym,rOnl), L(4,t4_4,PE,Opan,rOnl), L(5,t5_4,E,Vakh,rOnl)],
                    "ПТ": [L(1,t1_4,M,Maksym,rOnl), L(2,t2_4,Dram,Myh,rOnl), L(3,t3_4,I,ZhemVil,rOnl), L(4,t4_4,E,Vakh,rOnl), L(5,t5_4,Tech,Osyp,rOnl), L(6,t6_4,Pol,Lad,rOnl)]
                },
                week2: {
                    "ПН": [L(1,t1_4,Zar,Serg,r33), L(2,t2_4,U,Koz,r33), L(3,t3_4,A,Serg,r33), L(4,t4_4,M,Maksym,r33), L(5,t5_4,Hist,Kat,r33), L(6,t6_4,PE,Opan,rGym)],
                    "ВТ": [L(0,t0_4,Geo,Kob,r33), L(1,t1_4,M,Maksym,r33), L(2,t2_4,U,Koz,r33), L(3,t3_4,ULit,Koz,r33), L(4,t4_4,PE,Opan,rGym), L(5,t5_4,E,Vakh,r33), L(6,t6_4,Grom,Kat,r33)],
                    "СР": [L(0,t0_4,Pol,Lad,r33), L(1,t1_4,ULit,Koz,r33), L(2,t2_4,M,Maksym,r33), L(3,t3_4,U,Koz,r33), L(4,t4_4,Hist,Kat,r33), L(5,t5_4,E,Vakh,r33), L(6,t6_4,Geo,Kob,r33)],
                    "ЧТ": [L(0,t0_4,Nat,Paz,r33), L(1,t1_4,U,Koz,r33), L(2,t2_4,Zar,Serg,r33), L(3,t3_4,M,Maksym,r33), L(4,t4_4,PE,Opan,rGym), L(5,t5_4,E,Vakh,r33)],
                    "ПТ": [L(1,t1_4,M,Maksym,r33), L(2,t2_4,Dram,Myh,rAct), L(3,t3_4,I,ZhemVil,r20_26), L(4,t4_4,E,Vakh,r33), L(5,t5_4,Tech,Osyp,rMyst), L(6,t6_4,Pol,Lad,r33)]
                }
            },
            "6-Б": {
                week1: {
                    "ПН": [L(1,t1_4,M,Ukr,rOnl), L(2,t2_4,Pol,Lad,rOnl), L(3,t3_4,U,Maks,rOnl), L(4,t4_4,Eth,Serg,rOnl), L(5,t5_4,A,Serg,rOnl), L(6,t6_4,Hist,Kat,rOnl)],
                    "ВТ": [L(0,t0_4,U,Maks,rOnl), L(1,t1_4,M,Ukr,rOnl), L(2,t2_4,E,VakhYevt,rOnl), L(3,t3_4,ULit,Maks,rOnl), L(4,t4_4,Grom,Kat,rOnl), L(5,t5_4,PE,Opan,rOnl), L(6,t6_4,Geo,Kob,rOnl)],
                    "СР": [L(0,t0_4,Hist,Kat,rOnl), L(1,t1_4,M,Ukr,rOnl), L(2,t2_4,ULit,Maks,rOnl), L(3,t3_4,U,Maks,rOnl), L(4,t4_4,E,VakhYevt,rOnl), L(5,t5_4,Geo,Kob,rOnl), L(6,t6_4,PE,Opan,rOnl)],
                    "ЧТ": [L(1,t1_4,U,Maks,rOnl), L(2,t2_4,M,Ukr,rOnl), L(3,t3_4,Zar,Serg,rOnl), L(4,t4_4,E,VakhYevt,rOnl), L(5,t5_4,PE,Opan,rOnl), L(6,t6_4,Nat,Paz,rOnl)],
                    "ПТ": [L(1,t1_4,M,Ukr,rOnl), L(2,t2_4,I,ZhemVil,rOnl), L(3,t3_4,Dram,Myh,rOnl), L(4,t4_4,Pol,Lad,rOnl), L(5,t5_4,E,VakhYevt,rOnl), L(6,t6_4,Tech,Osyp,rOnl)]
                },
                week2: {
                    "ПН": [L(1,t1_4,M,Ukr,r30), L(2,t2_4,Pol,Lad,r30), L(3,t3_4,U,Maks,r30), L(4,t4_4,Zar,Serg,r30), L(5,t5_4,A,Serg,r30), L(6,t6_4,Hist,Kat,r30)],
                    "ВТ": [L(0,t0_4,U,Maks,r30), L(1,t1_4,M,Ukr,r30), L(2,t2_4,E,VakhYevt,r30), L(3,t3_4,ULit,Maks,r30), L(4,t4_4,Grom,Kat,r30), L(5,t5_4,PE,Opan,rGym), L(6,t6_4,Geo,Kob,r30)],
                    "СР": [L(0,t0_4,Hist,Kat,r30), L(1,t1_4,M,Ukr,r30), L(2,t2_4,ULit,Maks,r30), L(3,t3_4,U,Maks,r30), L(4,t4_4,E,VakhYevt,r30), L(5,t5_4,Geo,Kob,r30), L(6,t6_4,PE,Opan,rGym)],
                    "ЧТ": [L(1,t1_4,U,Maks,r30), L(2,t2_4,M,Ukr,r30), L(3,t3_4,Zar,Serg,r30), L(4,t4_4,E,VakhYevt,r30), L(5,t5_4,PE,Opan,rGym), L(6,t6_4,Nat,Paz,r30)],
                    "ПТ": [L(1,t1_4,M,Ukr,r30), L(2,t2_4,I,ZhemVil,r26_20), L(3,t3_4,Dram,Myh,rAct), L(4,t4_4,Pol,Lad,r30), L(5,t5_4,E,VakhYevt,r30), L(6,t6_4,Tech,Osyp,rMyst)]
                }
            },
            "6-В": {
                week1: {
                    "ПН": [L(0,t0_4,Nat,Paz,rOnl), L(1,t1_4,U,Pust,rOnl), L(2,t2_4,Zar,Pust,rOnl), L(3,t3_4,M,Sav,rOnl), L(4,t4_4,Hist,Kat,rOnl)],
                    "ВТ": [L(0,t0_4,M,Sav,rOnl), L(1,t1_4,U,Pust,rOnl), L(2,t2_4,Geo,Kob,rOnl), L(3,t3_4,ULit,Pust,rOnl), L(4,t4_4,E,Vakh,rOnl), L(5,t5_4,PE,Opan,rOnl), L(6,t6_4,Grom,Kat,rOnl)],
                    "СР": [L(0,t0_4,M,Sav,rOnl), L(1,t1_4,E,Vakh,rOnl), L(2,t2_4,U,Pust,rOnl), L(3,t3_4,ULit,Pust,rOnl), L(4,t4_4,Geo,Kob,rOnl), L(5,t5_4,Hist,Kat,rOnl), L(6,t6_4,A,Myh,rOnl)],
                    "ЧТ": [L(1,t1_4,M,Sav,rOnl), L(2,t2_4,Dram,Myh,rOnl), L(3,t3_4,Zar,Pust,rOnl), L(4,t4_4,U,Pust,rOnl), L(5,t5_4,E,Vakh,rOnl), L(6,t6_4,PE,Opan,rOnl)],
                    "ПТ": [L(1,t1_4,I,ZhemVakh,rOnl), L(2,t2_4,M,Sav,rOnl), L(3,t3_4,E,Vakh,rOnl), L(4,t4_4,Tech,Osyp,rOnl), L(5,t5_4,PE,Opan,rOnl)]
                },
                week2: {
                    "ПН": [L(0,t0_4,Nat,Paz,r34), L(1,t1_4,U,Pust,r34), L(2,t2_4,Zar,Pust,r34), L(3,t3_4,M,Sav,r34), L(4,t4_4,Hist,Kat,r34)],
                    "ВТ": [L(0,t0_4,M,Sav,r34), L(1,t1_4,U,Pust,r34), L(2,t2_4,Geo,Kob,r34), L(3,t3_4,ULit,Pust,r34), L(4,t4_4,E,Vakh,r34), L(5,t5_4,PE,Opan,rGym), L(6,t6_4,Grom,Kat,r34)],
                    "СР": [L(0,t0_4,M,Sav,r34), L(1,t1_4,E,Vakh,r34), L(2,t2_4,U,Pust,r34), L(3,t3_4,ULit,Pust,r34), L(4,t4_4,Geo,Kob,r34), L(5,t5_4,Hist,Kat,r34), L(6,t6_4,A,Myh,r34)],
                    "ЧТ": [L(1,t1_4,M,Sav,r34), L(2,t2_4,Dram,Myh,rAct), L(3,t3_4,Zar,Pust,r34), L(4,t4_4,U,Pust,r34), L(5,t5_4,E,Vakh,r34), L(6,t6_4,PE,Opan,rGym)],
                    "ПТ": [L(1,t1_4,I,ZhemVakh,r20_26), L(2,t2_4,M,Sav,r34), L(3,t3_4,E,Vakh,r34), L(4,t4_4,Tech,Osyp,rMyst), L(5,t5_4,PE,Opan,rGym)]
                }
            },
            "7-А": {
                week1: {
                    "ПН": [L(1,t1_5,Alg,Sav,rOnl), L(2,t2_5,E,Kuzn,rOnl), L(3,t3_5,Tech,Yarosh,rOnl), L(4,t4_5,Biol,Paz,rOnl), L(5,t5_5,Chem,Gorosh,rOnl), L(6,t6_5,ULit,Pust,rOnl)],
                    "ВТ": [L(1,t1_5,E,Kuzn,rOnl), L(2,t2_5,Biol,Paz,rOnl), L(3,t3_5,Geom,Sav,rOnl), L(4,t4_5,Geo,Danil,rOnl), L(5,t5_5,U,Pust,rOnl), L(6,t6_5,PE,Bovs,rOnl), L(7,t7_5,Grom,Dudar,rOnl)],
                    "СР": [L(1,t1_5,Alg,Sav,rOnl), L(2,t2_5,Dram,Myh,rOnl), L(3,t3_5,PE,Bovs,rOnl), L(4,t4_5,Zar,Serg,rOnl), L(5,t5_5,PE,Bovs,rOnl), L(6,t6_5,U,Pust,rOnl), L(7,t7_5,I,ZhemVil,rOnl)],
                    "ЧТ": [L(1,t1_5,Geo,Danil,rOnl), L(2,t2_5,HistU,Dudar,rOnl), L(3,t3_5,Geom,Sav,rOnl), L(4,t4_5,Phys,Yakus,rOnl), L(5,t5_5,PE,Bovs,rOnl), L(6,t6_5,ULit,Pust,rOnl)],
                    "ПТ": [L(1,t1_5,Zar,Serg,rOnl), L(2,t2_5,HistU,Dudar,rOnl), L(3,t3_5,Alg,Sav,rOnl), L(4,t4_5,E,Kuzn,rOnl), L(5,t5_5,U,Pust,rOnl), L(6,t6_5,A,Myh,rOnl)]
                },
                week2: {
                    "ПН": [L(1,t1_5,Alg,Sav,r39), L(2,t2_5,E,Kuzn,r39), L(3,t3_5,Tech,Yarosh,r39), L(4,t4_5,Biol,Paz,r39), L(5,t5_5,Chem,Gorosh,r41), L(6,t6_5,ULit,Pust,r41)],
                    "ВТ": [L(1,t1_5,E,Kuzn,r39), L(2,t2_5,Biol,Paz,r39), L(3,t3_5,Geom,Sav,r39), L(4,t4_5,Geo,Danil,r39), L(5,t5_5,U,Pust,r39), L(6,t6_5,PE,Bovs,rGym), L(7,t7_5,Zdor,Yarmol,r39)],
                    "СР": [L(1,t1_5,Alg,Sav,r39), L(2,t2_5,Dram,Myh,rAct), L(3,t3_5,PE,Bovs,r39), L(4,t4_5,E,Kuzn,r39), L(5,t5_5,PE,Bovs,rGym), L(6,t6_5,U,Pust,r39), L(7,t7_5,I,ZhemVil,r26_20)],
                    "ЧТ": [L(1,t1_5,Geo,Danil,r39), L(2,t2_5,HistU,Dudar,r39), L(3,t3_5,Geom,Sav,r39), L(4,t4_5,Phys,Yakus,r39), L(5,t5_5,PE,Bovs,rGym), L(6,t6_5,ULit,Pust,r39)],
                    "ПТ": [L(1,t1_5,Zar,Serg,r39), L(2,t2_5,HistU,Dudar,r39), L(3,t3_5,Alg,Sav,r39), L(4,t4_5,E,Kuzn,r39), L(5,t5_5,U,Pust,r39), L(6,t6_5,A,Myh,r39)]
                }
            },
            "7-Б": {
                week1: {
                    "ПН": [L(1,t1_5,Tech,Yarosh,rOnl), L(2,t2_5,Biol,Paz,rOnl), L(3,t3_5,E,Kuzn,rOnl), L(4,t4_5,ULit,Koz,rOnl), L(5,t5_5,Alg,Koval,rOnl), L(6,t6_5,Chem,Gorosh,rOnl)],
                    "ВТ": [L(1,t1_5,PE,Atam,rOnl), L(2,t2_5,Geom,Koval,rOnl), L(3,t3_5,E,Kuzn,rOnl), L(4,t4_5,Biol,Paz,rOnl), L(5,t5_5,Geo,Danil,rOnl), L(6,t6_5,Grom,Dudar,rOnl), L(7,t7_5,U,Koz,rOnl)],
                    "СР": [L(1,t1_5,Dram,Myh,rOnl), L(2,t2_5,Phys,Yakus,rOnl), L(3,t3_5,Alg,Koval,rOnl), L(4,t4_5,Zar,Serg,rOnl), L(5,t5_5,I,ZhemVil,rOnl), L(6,t6_5,U,Koz,rOnl), L(7,t7_5,PE,Atam,rOnl)],
                    "ЧТ": [L(1,t1_5,HistU,Dudar,rOnl), L(2,t2_5,Geo,Danil,rOnl), L(3,t3_5,Geom,Koval,rOnl), L(4,t4_5,ULit,Koz,rOnl), L(5,t5_5,PE,Atam,rOnl), L(6,t6_5,Phys,Yakus,rOnl)],
                    "ПТ": [L(1,t1_5,HistU,Dudar,rOnl), L(2,t2_5,Zar,Serg,rOnl), L(3,t3_5,U,Koz,rOnl), L(4,t4_5,A,Myh,rOnl), L(5,t5_5,Alg,Koval,rOnl), L(6,t6_5,E,Kuzn,rOnl)]
                },
                week2: {
                    "ПН": [L(1,t1_5,Tech,Yarosh,r37), L(2,t2_5,Biol,Paz,r37), L(3,t3_5,E,Kuzn,r37), L(4,t4_5,ULit,Koz,r37), L(5,t5_5,Alg,Koval,r37), L(6,t6_5,Chem,Gorosh,r41)],
                    "ВТ": [L(1,t1_5,PE,Atam,rGym), L(2,t2_5,Geom,Koval,r37), L(3,t3_5,E,Kuzn,r37), L(4,t4_5,Biol,Paz,r37), L(5,t5_5,Geo,Danil,r37), L(6,t6_5,Zdor,Yarmol,r37), L(7,t7_5,U,Koz,r37)],
                    "СР": [L(1,t1_5,Dram,Myh,rAct), L(2,t2_5,Phys,Yakus,r37), L(3,t3_5,Alg,Koval,r37), L(4,t4_5,E,Kuzn,r37), L(5,t5_5,I,ZhemVil,r26_20), L(6,t6_5,U,Koz,r37), L(7,t7_5,PE,Atam,rGym)],
                    "ЧТ": [L(1,t1_5,HistU,Dudar,r37), L(2,t2_5,Geo,Danil,r37), L(3,t3_5,Geom,Koval,r37), L(4,t4_5,ULit,Koz,r37), L(5,t5_5,PE,Atam,rGym), L(6,t6_5,Phys,Yakus,r37)],
                    "ПТ": [L(1,t1_5,HistU,Dudar,r37), L(2,t2_5,Zar,Serg,r37), L(3,t3_5,U,Koz,r37), L(4,t4_5,A,Myh,r37), L(5,t5_5,Alg,Koval,r37), L(6,t6_5,E,Kuzn,r37)]
                }
            },
            "7-В": {
                week1: {
                    "ПН": [L(1,t1_5,E,Kuzn,rOnl), L(2,t2_5,Tech,Yarosh,rOnl), L(3,t3_5,Biol,Paz,rOnl), L(4,t4_5,Alg,Sav,rOnl), L(5,t5_5,ULit,Pust,rOnl), L(6,t6_5,Pol,Lad,rOnl), L(7,t7_5,Chem,Gorosh,rOnl)],
                    "ВТ": [L(1,t1_5,Geom,Sav,rOnl), L(2,t2_5,PE,Atam,rOnl), L(3,t3_5,Geo,Danil,rOnl), L(4,t4_5,E,Kuzn,rOnl), L(5,t5_5,Biol,Paz,rOnl), L(6,t6_5,U,Pust,rOnl), L(7,t7_5,Zdor,Yarmol,rOnl)],
                    "СР": [L(1,t1_5,Phys,Yakus,rOnl), L(2,t2_5,Pol,Lad,rOnl), L(3,t3_5,STEM,Kochev,rOnl), L(4,t4_5,Alg,Sav,rOnl), L(5,t5_5,Zar,Serg,rOnl), L(6,t6_5,PE,Atam,rOnl), L(7,t7_5,U,Pust,rOnl)],
                    "ЧТ": [L(1,t1_5,Geom,Sav,rOnl), L(2,t2_5,Phys,Yakus,rOnl), L(3,t3_5,Geo,Danil,rOnl), L(4,t4_5,HistU,Dudar,rOnl), L(5,t5_5,I,ZhemVil,rOnl), L(6,t6_5,PE,Atam,rOnl), L(7,t7_5,ULit,Pust,rOnl)],
                    "ПТ": [L(1,t1_5,Alg,Sav,rOnl), L(2,t2_5,A,Myh,rOnl), L(3,t3_5,HistU,Dudar,rOnl), L(4,t4_5,Zar,Serg,rOnl), L(5,t5_5,E,Kuzn,rOnl), L(6,t6_5,U,Pust,rOnl)]
                },
                week2: {
                    "ПН": [L(1,t1_5,E,Kuzn,r36), L(2,t2_5,Tech,Yarosh,r36), L(3,t3_5,Biol,Paz,r36), L(4,t4_5,Alg,Sav,r36), L(5,t5_5,ULit,Pust,r36), L(6,t6_5,Pol,Lad,r36), L(7,t7_5,Chem,Gorosh,r41)],
                    "ВТ": [L(1,t1_5,Geom,Sav,r36), L(2,t2_5,PE,Atam,rGym), L(3,t3_5,Geo,Danil,r36), L(4,t4_5,E,Kuzn,r36), L(5,t5_5,Biol,Paz,r36), L(6,t6_5,U,Pust,r36), L(7,t7_5,Grom,Dudar,r36)],
                    "СР": [L(1,t1_5,Phys,Yakus,r36), L(2,t2_5,Pol,Lad,r36), L(3,t3_5,STEM,Kochev,r36), L(4,t4_5,Alg,Sav,r36), L(5,t5_5,E,Kuzn,r36), L(6,t6_5,PE,Atam,rGym), L(7,t7_5,U,Pust,r36)],
                    "ЧТ": [L(1,t1_5,Geom,Sav,r36), L(2,t2_5,Phys,Yakus,r36), L(3,t3_5,Geo,Danil,r36), L(4,t4_5,HistU,Dudar,r36), L(5,t5_5,I,ZhemVil,r26_20), L(6,t6_5,PE,Atam,rGym), L(7,t7_5,ULit,Pust,r36)],
                    "ПТ": [L(1,t1_5,Alg,Sav,r36), L(2,t2_5,A,Myh,r36), L(3,t3_5,HistU,Dudar,r36), L(4,t4_5,Zar,Serg,r36), L(5,t5_5,E,Kuzn,r36), L(6,t6_5,U,Pust,r36)]
                }
            },
            "8-А": {
                week1: {
                    "ПН": [L(1,t1_5,PE,Atam,rOnl), L(2,t2_5,Alg,Yarmol,rOnl), L(3,t3_5,E,Greb,rOnl), L(4,t4_5,HistU,Dudar,rOnl), L(5,t5_5,Phys,Yakus,rOnl), L(6,t6_5,U,Did,rOnl)],
                    "ВТ": [L(1,t1_5,U,Did,rOnl), L(2,t2_5,Geom,Yarmol,rOnl), L(3,t3_5,STEM,Kochev,rOnl), L(4,t4_5,Zar,Rysich,rOnl), L(5,t5_5,Geo,Kob,rOnl), L(6,t6_5,PE,Atam,rOnl), L(7,t7_5,Phys,Yakus,rOnl)],
                    "СР": [L(1,t1_5,Alg,Yarmol,rOnl), L(2,t2_5,E,Greb,rOnl), L(3,t3_5,HistU,Dudar,rOnl), L(5,t5_5,Tech,Osyp,rOnl), L(6,t6_5,ULit,Did,rOnl), L(7,t7_5,Biol,Paz,rOnl)],
                    "ЧТ": [L(1,t1_5,Geo,Kob,rOnl), L(2,t2_5,Geom,Yarmol,rOnl), L(3,t3_5,PE,Atam,rOnl), L(4,t4_5,I,VilKlym,rOnl), L(5,t5_5,Biol,Paz,rOnl), L(6,t6_5,U,Did,rOnl), L(7,t7_5,E,Greb,rOnl)],
                    "ПТ": [L(1,t1_5,Pidpr,Probot,rOnl), L(2,t2_5,Chem,Amr,rOnl), L(3,t3_5,ULit,Did,rOnl), L(4,t4_5,Alg,Yarmol,rOnl), L(5,t5_5,Grom,Dudar,rOnl), L(6,t6_5,A,Myh,rOnl)]
                },
                week2: {
                    "ПН": [L(1,t1_5,PE,Atam,rGym), L(2,t2_5,Alg,Yarmol,r35), L(3,t3_5,E,Greb,r35), L(4,t4_5,HistU,Dudar,r35), L(5,t5_5,Phys,Yakus,r35), L(6,t6_5,U,Did,r35)],
                    "ВТ": [L(1,t1_5,U,Did,r35), L(2,t2_5,Geom,Yarmol,r35), L(3,t3_5,STEM,Kochev,r35), L(4,t4_5,Zar,Rysich,r35), L(5,t5_5,Geo,Kob,r35), L(6,t6_5,PE,Atam,rGym), L(7,t7_5,Phys,Yakus,r35)],
                    "СР": [L(1,t1_5,Alg,Yarmol,r35), L(2,t2_5,E,Greb,r35), L(3,t3_5,HistU,Dudar,r35), L(5,t5_5,Tech,Osyp,rMyst), L(6,t6_5,ULit,Did,r35), L(7,t7_5,Biol,Paz,r35)],
                    "ЧТ": [L(1,t1_5,Geo,Kob,r35), L(2,t2_5,Geom,Yarmol,r35), L(3,t3_5,PE,Atam,rGym), L(4,t4_5,I,ProbotVil,r26_20), L(5,t5_5,Biol,Paz,r35), L(6,t6_5,U,Did,r35), L(7,t7_5,E,Greb,r35)],
                    "ПТ": [L(1,t1_5,Pidpr,Probot,r26), L(2,t2_5,Chem,Amr,r35), L(3,t3_5,ULit,Did,r35), L(4,t4_5,Alg,Yarmol,r35), L(5,t5_5,Grom,Dudar,r35), L(6,t6_5,A,Myh,rAct)]
                }
            },
            "8-Б": {
                week1: {
                    "ПН": [L(1,t1_5,Alg,Maksym,rOnl), L(2,t2_5,Phys,Yakus,rOnl), L(3,t3_5,PE,Atam,rOnl), L(4,t4_5,E,Greb,rOnl), L(5,t5_5,U,Koz,rOnl), L(6,t6_5,HistU,Dudar,rOnl)],
                    "ВТ": [L(1,t1_5,Geom,Maksym,rOnl), L(2,t2_5,Phys,Yakus,rOnl), L(3,t3_5,PE,Atam,rOnl), L(4,t4_5,E,Greb,rOnl), L(5,t5_5,U,Koz,rOnl), L(6,t6_5,Zar,Serg,rOnl), L(7,t7_5,Geo,Kob,rOnl)],
                    "СР": [L(1,t1_5,HistU,Dudar,rOnl), L(2,t2_5,Chem,Amr,rOnl), L(3,t3_5,Tech,Osyp,rOnl), L(4,t4_5,Alg,Maksym,rOnl), L(5,t5_5,Zar,Serg,rOnl), L(6,t6_5,Biol,Paz,rOnl), L(7,t7_5,Dram,Myh,rOnl)],
                    "ЧТ": [L(1,t1_5,Biol,Paz,rOnl), L(2,t2_5,Geo,Kob,rOnl), L(3,t3_5,Geom,Maksym,rOnl), L(4,t4_5,PE,Atam,rOnl), L(5,t5_5,U,Koz,rOnl), L(6,t6_5,E,Greb,rOnl), L(7,t7_5,I,VilKlym,rOnl)],
                    "ПТ": [L(1,t1_5,ULit,Koz,rOnl), L(2,t2_5,Ozn,Yarmol,rOnl), L(3,t3_5,Chem,Amr,rOnl), L(4,t4_5,Alg,Maksym,rOnl), L(5,t5_5,A,Rysich,rOnl), L(6,t6_5,I,ProZhem,rOnl)]
                },
                week2: {
                    "ПН": [L(1,t1_5,Alg,Maksym,r33), L(2,t2_5,Phys,Yakus,r33), L(3,t3_5,PE,Atam,rGym), L(4,t4_5,E,Greb,r33), L(5,t5_5,U,Koz,r33), L(6,t6_5,HistU,Dudar,r33)],
                    "ВТ": [L(1,t1_5,Geom,Maksym,r33), L(2,t2_5,Phys,Yakus,r33), L(3,t3_5,PE,Atam,rGym), L(4,t4_5,E,Greb,r33), L(5,t5_5,U,Koz,r33), L(6,t6_5,Zar,Serg,r33), L(7,t7_5,Geo,Kob,r33)],
                    "СР": [L(1,t1_5,HistU,Dudar,r33), L(2,t2_5,Chem,Amr,r33), L(3,t3_5,Tech,Osyp,rMyst), L(4,t4_5,Alg,Maksym,r33), L(5,t5_5,ULit,Koz,r33), L(6,t6_5,Biol,Paz,r33), L(7,t7_5,Dram,Myh,rAct)],
                    "ЧТ": [L(1,t1_5,Biol,Paz,r33), L(2,t2_5,Geo,Kob,r33), L(3,t3_5,Geom,Maksym,r33), L(4,t4_5,PE,Atam,rGym), L(5,t5_5,U,Koz,r33), L(6,t6_5,E,Greb,r33), L(7,t7_5,I,ProZhem,r20_26)],
                    "ПТ": [L(1,t1_5,ULit,Koz,r33), L(2,t2_5,Ozn,Yarmol,r26), L(3,t3_5,Chem,Amr,r33), L(4,t4_5,Alg,Maksym,r33), L(5,t5_5,A,Rysich,rAct), L(6,t6_5,I,ProZhem,r26_20)]
                }
            },
            "8-В": {
                week1: {
                    "ПН": [L(1,t1_5,Alg,Yarmol,rOnl), L(2,t2_5,E,Greb,rOnl), L(3,t3_5,HistU,Dudar,rOnl), L(4,t4_5,Phys,Yakus,rOnl), L(5,t5_5,Pol,Lad,rOnl), L(6,t6_5,U,Koz,rOnl), L(7,t7_5,PE,Opan,rOnl)],
                    "ВТ": [L(1,t1_5,Geo,Danil,rOnl), L(2,t2_5,STEM,Kochev,rOnl), L(3,t3_5,Geom,Yarmol,rOnl), L(4,t4_5,Phys,Yakus,rOnl), L(5,t5_5,Zar,Rysich,rOnl), L(6,t6_5,U,Koz,rOnl), L(7,t7_5,PE,Opan,rOnl)],
                    "СР": [L(1,t1_5,Biol,Paz,rOnl), L(2,t2_5,Alg,Yarmol,rOnl), L(3,t3_5,Pol,Lad,rOnl), L(4,t4_5,Chem,Amr,rOnl), L(5,t5_5,ULit,Koz,rOnl), L(6,t6_5,E,Greb,rOnl), L(7,t7_5,HistU,Dudar,rOnl)],
                    "ЧТ": [L(1,t1_5,Geom,Yarmol,rOnl), L(2,t2_5,Biol,Paz,rOnl), L(3,t3_5,I,ProZhem,rOnl), L(4,t4_5,Geo,Danil,rOnl), L(5,t5_5,E,Greb,rOnl), L(6,t6_5,U,Koz,rOnl), L(7,t7_5,PE,Opan,rOnl)],
                    "ПТ": [L(1,t1_5,Chem,Amr,rOnl), L(2,t2_5,ULit,Koz,rOnl), L(3,t3_5,Alg,Yarmol,rOnl), L(4,t4_5,Grom,Dudar,rOnl), L(5,t5_5,A,Myh,rOnl), L(6,t6_5,Pidpr,Probot,rOnl), L(7,t7_5,Tech,Osyp,rOnl)]
                },
                week2: {
                    "ПН": [L(1,t1_5,Alg,Yarmol,r30), L(2,t2_5,E,Greb,r30), L(3,t3_5,HistU,Dudar,r30), L(4,t4_5,Phys,Yakus,r30), L(5,t5_5,Pol,Lad,r30), L(6,t6_5,U,Koz,r30), L(7,t7_5,PE,Opan,rGym)],
                    "ВТ": [L(1,t1_5,Geo,Danil,r30), L(2,t2_5,STEM,Kochev,r30), L(3,t3_5,Geom,Yarmol,r30), L(4,t4_5,Phys,Yakus,r30), L(5,t5_5,Zar,Rysich,r30), L(6,t6_5,U,Koz,r30), L(7,t7_5,PE,Opan,rGym)],
                    "СР": [L(1,t1_5,Biol,Paz,r30), L(2,t2_5,Alg,Yarmol,r30), L(3,t3_5,Pol,Lad,r30), L(4,t4_5,Chem,Amr,r30), L(5,t5_5,ULit,Koz,r30), L(6,t6_5,E,Greb,r30), L(7,t7_5,HistU,Dudar,r30)],
                    "ЧТ": [L(1,t1_5,Geom,Yarmol,r30), L(2,t2_5,Biol,Paz,r30), L(3,t3_5,I,ProZhem,r26_20), L(4,t4_5,Geo,Danil,r30), L(5,t5_5,E,Greb,r30), L(6,t6_5,U,Koz,r30), L(7,t7_5,PE,Opan,rGym)],
                    "ПТ": [L(1,t1_5,Chem,Amr,r30), L(2,t2_5,ULit,Koz,r30), L(3,t3_5,Alg,Yarmol,r30), L(4,t4_5,Grom,Dudar,r30), L(5,t5_5,A,Myh,rAct), L(6,t6_5,Pidpr,Probot,r30), L(7,t7_5,Tech,Osyp,rMyst)]
                }
            },
            "9-А": {
                week1: {
                    "ПН": [L(1,t1_5,PE,Sarancha,rGym), L(2,t2_5,Phys,Lavr,r39), L(3,t3_5,Alg,Ukr,r25), L(4,t4_5,E,VakhKuzn,r33_34), L(5,t5_5,Zar,Rysich,r25), L(6,t6_5,HistW,Kat,r25), L(7,t7_5,I,ProZhem,r26_20)],
                    "ВТ": [L(1,t1_5,Geom,Ukr,r25), L(2,t2_5,Phys,Lavr,r39), L(3,t3_5,ULit,Did,r25), L(4,t4_5,Chem,Amr,r40), L(5,t5_5,A,Myh,rAct), L(6,t6_5,Prav,Kat,r25), L(7,t7_5,HistW,Kat,r25)],
                    "СР": [L(1,t1_5,PE,Sarancha,rGym), L(2,t2_5,Alg,Ukr,r25), L(3,t3_5,Biol,Paz,r25), L(4,t4_5,Pol,Lad,r25), L(5,t5_5,U,Did,r25), L(6,t6_5,E,VakhKuzn,r33_34), L(7,t7_5,HistW,Kat,r25)],
                    "ЧТ": [L(1,t1_5,PE,Sarancha,rGym), L(2,t2_5,Geom,Ukr,r25), L(3,t3_5,Chem,Amr,r40), L(4,t4_5,Geo,Kob,r25), L(5,t5_5,Zar,Rysich,r25), L(6,t6_5,Tech,OsypYarosh,r25_Myst), L(7,t7_5,U,Did,r25)],
                    "ПТ": [L(1,t1_5,Biol,Paz,r41), L(2,t2_5,Phys,Lavr,r39_25), L(3,t3_5,I,ProZhem,r26_20), L(4,t4_5,ULit,Did,r25), L(5,t5_5,Alg,Ukr,r25), L(6,t6_5,Ozn,Amr,r25_40), L(7,t7_5,Pol,Lad,r25)]
                },
                week2: {
                    "ПН": [L(1,t1_5,PE,Sarancha,rGym), L(2,t2_5,Phys,Lavr,rOnl), L(3,t3_5,Alg,Ukr,rOnl), L(4,t4_5,E,VakhKuzn,rOnl), L(5,t5_5,Zar,Rysich,rOnl), L(6,t6_5,HistU,Kat,rOnl), L(7,t7_5,I,ProZhem,rOnl)],
                    "ВТ": [L(1,t1_5,Geom,Ukr,rOnl), L(2,t2_5,Phys,Lavr,rOnl), L(3,t3_5,ULit,Did,rOnl), L(4,t4_5,Chem,Amr,rOnl), L(5,t5_5,A,Myh,rOnl), L(6,t6_5,Prav,Kat,rOnl), L(7,t7_5,HistU,Kat,rOnl)],
                    "СР": [L(1,t1_5,PE,Sarancha,rGym), L(2,t2_5,Alg,Ukr,rOnl), L(3,t3_5,Biol,Paz,rOnl), L(4,t4_5,Pol,Lad,rOnl), L(5,t5_5,U,Did,rOnl), L(6,t6_5,E,VakhKuzn,rOnl), L(7,t7_5,HistU,Kat,rOnl)],
                    "ЧТ": [L(1,t1_5,PE,Sarancha,rGym), L(2,t2_5,Geom,Ukr,rOnl), L(3,t3_5,Chem,Amr,rOnl), L(4,t4_5,Geo,Kob,rOnl), L(5,t5_5,Zar,Rysich,rOnl), L(6,t6_5,Tech,OsypYarosh,rOnl), L(7,t7_5,U,Did,rOnl)],
                    "ПТ": [L(1,t1_5,Biol,Paz,rOnl), L(2,t2_5,Phys,Lavr,rOnl), L(3,t3_5,I,ProZhem,rOnl), L(4,t4_5,ULit,Did,rOnl), L(5,t5_5,Alg,Ukr,rOnl), L(6,t6_5,Ozn,Amr,rOnl), L(7,t7_5,Pol,Lad,rOnl)]
                }
            },
            "9-Б": {
                week1: {
                    "ПН": [L(1,t1_5,Phys,Lavr,r41), L(2,t2_5,PE,Atam,rGym), L(3,t3_5,I,ProZhem,r26_20), L(4,t4_5,Alg,Ukr,r41), L(5,t5_5,E,Greb,r41), L(6,t6_5,Zar,Rysich,r41), L(7,t7_5,HistU,Dudar,r41)],
                    "ВТ": [L(1,t1_5,Phys,Lavr,r41), L(2,t2_5,HistU,Dudar,r41), L(3,t3_5,Geom,Ukr,r41), L(4,t4_5,Prav,Kat,r41), L(5,t5_5,Chem,Amr,r40), L(6,t6_5,A,Myh,rAct), L(7,t7_5,U,Did,r41)],
                    "СР": [L(1,t1_5,Pol,Lad,r41), L(2,t2_5,Geo,Kob,r41), L(3,t3_5,Alg,Ukr,r41), L(4,t4_5,Biol,Paz,r41), L(5,t5_5,PE,Atam,rGym), L(6,t6_5,ULit,Maks,r41), L(7,t7_5,E,Greb,r41)],
                    "ЧТ": [L(1,t1_5,Geom,Ukr,r41), L(2,t2_5,I,ProZhem,r20_26), L(3,t3_5,Geo,Kob,r41), L(4,t4_5,Chem,Amr,r40), L(5,t5_5,ULit,Maks,r41), L(6,t6_5,Zar,Rysich,r41), L(7,t7_5,Tech,Osyp,rMyst)],
                    "ПТ": [L(1,t1_5,PE,Atam,rGym), L(2,t2_5,U,Did,r41), L(3,t3_5,Phys,Lavr,r41), L(4,t4_5,Alg,Ukr,r41), L(5,t5_5,Biol,Paz,r41), L(6,t6_5,Pol,Lad,r41), L(7,t7_5,Ozn,Amr,r41)]
                },
                week2: {
                    "ПН": [L(1,t1_5,Phys,Lavr,rOnl), L(2,t2_5,PE,Atam,rOnl), L(3,t3_5,I,ProZhem,rOnl), L(4,t4_5,Alg,Ukr,rOnl), L(5,t5_5,E,Greb,rOnl), L(6,t6_5,Zar,Rysich,rOnl), L(7,t7_5,HistU,Dudar,rOnl)],
                    "ВТ": [L(1,t1_5,Phys,Lavr,rOnl), L(2,t2_5,HistU,Dudar,rOnl), L(3,t3_5,Geom,Ukr,rOnl), L(4,t4_5,Prav,Kat,rOnl), L(5,t5_5,Chem,Amr,rOnl), L(6,t6_5,A,Myh,rOnl), L(7,t7_5,U,Did,rOnl)],
                    "СР": [L(1,t1_5,Pol,Lad,rOnl), L(2,t2_5,Geo,Kob,rOnl), L(3,t3_5,Alg,Ukr,rOnl), L(4,t4_5,Biol,Paz,rOnl), L(5,t5_5,PE,Atam,rOnl), L(6,t6_5,ULit,Maks,rOnl), L(7,t7_5,E,Greb,rOnl)],
                    "ЧТ": [L(1,t1_5,Geom,Ukr,rOnl), L(2,t2_5,I,ProZhem,rOnl), L(3,t3_5,Geo,Kob,rOnl), L(4,t4_5,Chem,Amr,rOnl), L(5,t5_5,ULit,Maks,rOnl), L(6,t6_5,Zar,Rysich,rOnl), L(7,t7_5,Tech,Osyp,rOnl)],
                    "ПТ": [L(1,t1_5,PE,Atam,rOnl), L(2,t2_5,U,Did,rOnl), L(3,t3_5,Phys,Lavr,rOnl), L(4,t4_5,Alg,Ukr,rOnl), L(5,t5_5,Biol,Paz,rOnl), L(6,t6_5,Pol,Lad,rOnl), L(7,t7_5,Ozn,Amr,rOnl)]
                }
            },
            "9-В": {
                week1: {
                    "ПН": [L(1,t1_5,I,ProZhem,r26_20), L(2,t2_5,Alg,Ukr,r40), L(3,t3_5,Phys,Lavr,r40), L(4,t4_5,PE,Atam,rGym), L(5,t5_5,HistU,Dudar,r40), L(6,t6_5,Zar,Serg,r40), L(7,t7_5,E,Greb,r40)],
                    "ВТ": [L(1,t1_5,HistU,Dudar,r40), L(2,t2_5,Geom,Ukr,r40), L(3,t3_5,Phys,Lavr,r40), L(4,t4_5,ULit,Did,r40), L(5,t5_5,Prav,Kat,r40), L(6,t6_5,Chem,Amr,r40), L(7,t7_5,A,Myh,rAct)],
                    "СР": [L(1,t1_5,E,Greb,r40), L(2,t2_5,Biol,Paz,r40), L(3,t3_5,PE,Atam,rGym), L(4,t4_5,Alg,Ukr,r40), L(5,t5_5,Nim,Yevt,r40), L(6,t6_5,Geo,Kob,r40), L(7,t7_5,U,Did,r40)],
                    "ЧТ": [L(1,t1_5,I,ProZhem,r26_20), L(2,t2_5,Chem,Amr,r40), L(3,t3_5,Geom,Ukr,r40), L(4,t4_5,U,Did,r40), L(5,t5_5,Geo,Kob,r40), L(6,t6_5,Zar,Serg,r40), L(7,t7_5,Tech,Osyp,rMyst)],
                    "ПТ": [L(1,t1_5,Phys,Lavr,r40), L(2,t2_5,PE,Atam,rGym), L(3,t3_5,Alg,Ukr,r40), L(4,t4_5,Biol,Paz,r40), L(5,t5_5,Ozn,Amr,r40), L(6,t6_5,ULit,Did,r40), L(7,t7_5,Nim,Yevt,r40)]
                },
                week2: {
                    "ПН": [L(1,t1_5,I,ProZhem,rOnl), L(2,t2_5,Alg,Ukr,rOnl), L(3,t3_5,Phys,Lavr,rOnl), L(4,t4_5,PE,Atam,rOnl), L(5,t5_5,HistU,Dudar,rOnl), L(6,t6_5,Zar,Serg,rOnl), L(7,t7_5,E,Greb,rOnl)],
                    "ВТ": [L(1,t1_5,HistU,Dudar,rOnl), L(2,t2_5,Geom,Ukr,rOnl), L(3,t3_5,Phys,Lavr,rOnl), L(4,t4_5,ULit,Did,rOnl), L(5,t5_5,Prav,Kat,rOnl), L(6,t6_5,Chem,Amr,rOnl), L(7,t7_5,A,Myh,rOnl)],
                    "СР": [L(1,t1_5,E,Greb,rOnl), L(2,t2_5,Biol,Paz,rOnl), L(3,t3_5,PE,Atam,rOnl), L(4,t4_5,Alg,Ukr,rOnl), L(5,t5_5,Nim,Yevt,rOnl), L(6,t6_5,Geo,Kob,rOnl), L(7,t7_5,U,Did,rOnl)],
                    "ЧТ": [L(1,t1_5,I,ProZhem,rOnl), L(2,t2_5,Chem,Amr,rOnl), L(3,t3_5,Geom,Ukr,rOnl), L(4,t4_5,U,Did,rOnl), L(5,t5_5,Geo,Kob,rOnl), L(6,t6_5,Zar,Serg,rOnl), L(7,t7_5,Tech,Osyp,rOnl)],
                    "ПТ": [L(1,t1_5,Phys,Lavr,rOnl), L(2,t2_5,PE,Atam,rOnl), L(3,t3_5,Alg,Ukr,rOnl), L(4,t4_5,Biol,Paz,rOnl), L(5,t5_5,Ozn,Amr,rOnl), L(6,t6_5,ULit,Did,rOnl), L(7,t7_5,Nim,Yevt,rOnl)]
                }
            },
            "10-А": {
                week1: {
                    "ПН": [L(1,t1_5,Alg,Ukr,r26), L(2,t2_5,PE,Sarancha,rGym), L(3,t3_5,Phys,Yakus,r26), L(4,t4_5,U,ProbotO,r26), L(5,t5_5,Grom,Kat,r26), L(6,t6_5,I,ProZhem,r26_20)],
                    "ВТ": [L(1,t1_5,ULit,ProbotO,r26), L(2,t2_5,ULit,ProbotO,r26), L(3,t3_5,Biol,Paz,r26), L(4,t4_5,HistU,Dudar,r26), L(5,t5_5,Geom,Ukr,r26), L(6,t6_5,Phys,Yakus,r26)],
                    "СР": [L(1,t1_5,Alg,Ukr,r26), L(2,t2_5,PE,Sarancha,rGym), L(3,t3_5,ULit,ProbotO,r26), L(4,t4_5,Chem,Gorosh,r26), L(5,t5_5,Chem,Gorosh,r26), L(6,t6_5,HistU,Dudar,r26), L(7,t7_5,E,Kuzn,r26)],
                    "ЧТ": [L(1,t1_5,U,ProbotO,r26), L(2,t2_5,A,Myh,rAct), L(3,t3_5,PE,Sarancha,rGym), L(4,t4_5,E,Kuzn,r26), L(5,t5_5,HistU,Dudar,r26), L(6,t6_5,U,ProbotO,r26), L(7,t7_5,Phys,Yakus,r26)],
                    "ПТ": [L(1,t1_5,U,ProbotO,r26), L(2,t2_5,Geom,Ukr,r26), L(3,t3_5,Biol,Paz,r26), L(4,t4_5,Grom,Kat,r26), L(5,t5_5,Zar,Serg,r26), L(6,t6_5,Geo,Yakus,r26), L(7,t7_5,U,ProbotO,r26)]
                },
                week2: {
                    "ПН": [L(1,t1_5,Alg,Ukr,rOnl), L(2,t2_5,PE,Sarancha,rOnl), L(3,t3_5,Phys,Yakus,rOnl), L(4,t4_5,U,ProbotO,rOnl), L(5,t5_5,Grom,Kat,rOnl), L(6,t6_5,I,ProZhem,rOnl)],
                    "ВТ": [L(1,t1_5,ULit,ProbotO,rOnl), L(2,t2_5,ULit,ProbotO,rOnl), L(3,t3_5,Biol,Paz,rOnl), L(4,t4_5,HistU,Dudar,rOnl), L(5,t5_5,Geom,Ukr,rOnl), L(6,t6_5,Phys,Yakus,rOnl)],
                    "СР": [L(1,t1_5,Alg,Ukr,rOnl), L(2,t2_5,PE,Sarancha,rOnl), L(3,t3_5,ULit,ProbotO,rOnl), L(4,t4_5,Geo,Yakus,rOnl), L(5,t5_5,Chem,Gorosh,rOnl), L(6,t6_5,Zar,Serg,rOnl), L(7,t7_5,E,Kuzn,rOnl)],
                    "ЧТ": [L(1,t1_5,U,ProbotO,rOnl), L(2,t2_5,A,Myh,rOnl), L(3,t3_5,PE,Sarancha,rOnl), L(4,t4_5,E,Kuzn,rOnl), L(5,t5_5,HistU,Dudar,rOnl), L(6,t6_5,U,ProbotO,rOnl), L(7,t7_5,Phys,Yakus,rOnl)],
                    "ПТ": [L(1,t1_5,U,ProbotO,rOnl), L(2,t2_5,Geom,Ukr,rOnl), L(3,t3_5,Biol,Paz,rOnl), L(4,t4_5,Grom,Kat,rOnl), L(5,t5_5,Zar,Serg,rOnl), L(6,t6_5,Geo,Yakus,rOnl), L(7,t7_5,U,ProbotO,rOnl)]
                }
            },
            "11-А": {
                week1: {
                    "ПН": [L(1,t1_5,ULit,PustV,r34), L(2,t2_5,U,PustV,r34), L(3,t3_5,PE,Sarancha,rGym), L(4,t4_5,Chem,Gorosh,r40), L(5,t5_5,I,ProZhem,r26_20), L(6,t6_5,Phys,Yakus,r34), L(7,t7_5,HistU,Kat,r34)],
                    "ВТ": [L(1,t1_5,Biol,Paz,r34), L(2,t2_5,Geo,Danil,r34), L(3,t3_5,Phys,Yakus,r34), L(4,t4_5,Geom,Ukr,r34), L(5,t5_5,Zakh,Manokhin,rZakh), L(6,t6_5,E,Kuzn,r34)],
                    "СР": [L(1,t1_5,ULit,PustV,r34), L(2,t2_5,ULit,PustV,r34), L(3,t3_5,PE,Sarancha,rGym), L(4,t4_5,Alg,Ukr,r34), L(5,t5_5,U,PustVPustE,r34), L(6,t6_5,Chem,Gorosh,r40), L(7,t7_5,Zar,PustV,r34)],
                    "ЧТ": [L(1,t1_5,A,Myh,rAct), L(2,t2_5,PE,Sarancha,rGym), L(3,t3_5,Phys,Yakus,r34), L(4,t4_5,Geom,Ukr,r34), L(5,t5_5,Zakh,Manokhin,rZakh), L(6,t6_5,E,Kuzn,r34), L(7,t7_5,U,PustV,r34)],
                    "ПТ": [L(1,t1_5,Alg,Ukr,r34), L(2,t2_5,Biol,Paz,r34), L(3,t3_5,HistU,Kat,r34), L(4,t4_5,Astr,Yakus,r34), L(5,t5_5,Zar,PustV,r34), L(6,t6_5,ULit,PustV,r34), L(7,t7_5,U,Pust,r34)]
                },
                week2: {
                    "ПН": [L(1,t1_5,ULit,PustV,rOnl), L(2,t2_5,U,PustV,rOnl), L(3,t3_5,PE,Sarancha,rOnl), L(4,t4_5,Chem,Gorosh,rOnl), L(5,t5_5,I,ProZhem,rOnl), L(6,t6_5,Phys,Yakus,rOnl), L(7,t7_5,HistU,Kat,rOnl)],
                    "ВТ": [L(1,t1_5,Biol,Paz,rOnl), L(2,t2_5,Geo,Danil,rOnl), L(3,t3_5,Phys,Yakus,rOnl), L(4,t4_5,Geom,Ukr,rOnl), L(5,t5_5,Zakh,Manokhin,rOnl), L(6,t6_5,E,Kuzn,rOnl)],
                    "СР": [L(1,t1_5,ULit,PustV,rOnl), L(2,t2_5,ULit,PustV,rOnl), L(3,t3_5,PE,Sarancha,rOnl), L(4,t4_5,Alg,Ukr,rOnl), L(5,t5_5,U,PustVPustE,rOnl), L(6,t6_5,Chem,Gorosh,rOnl), L(7,t7_5,Zar,PustV,rOnl)],
                    "ЧТ": [L(1,t1_5,A,Myh,rOnl), L(2,t2_5,PE,Sarancha,rOnl), L(3,t3_5,Phys,Yakus,rOnl), L(4,t4_5,Geom,Ukr,rOnl), L(5,t5_5,Zakh,Manokhin,rOnl), L(6,t6_5,E,Kuzn,rOnl), L(7,t7_5,U,PustV,rOnl)],
                    "ПТ": [L(1,t1_5,Alg,Ukr,rOnl), L(2,t2_5,Biol,Paz,rOnl), L(3,t3_5,HistU,Kat,rOnl), L(4,t4_5,Astr,Yakus,rOnl), L(5,t5_5,Zar,PustV,rOnl), L(6,t6_5,ULit,PustV,rOnl), L(7,t7_5,U,Pust,rOnl)]
                }
            }
        },
        teacher: {
            "Амрахова Ірина Вікторівна": {
                week1: {
                    "ПН": [L("",t2_4,Nat,"5-Б",r37), L("",t4_4,Nat,"5-А",r39), L("",t5_4,Nat,"5-В",r36), L("",t6_4,Nat,"5-Б",r37)],
                    "ВТ": [L("",t4_5,Chem,"9-А",r40), L("",t5_5,Chem,"9-Б",r40), L("",t6_5,Chem,"9-В",r40), L("",t4_4,Nat,"5-В",r36), L("",t5_4,Nat,"5-А",r39), L("",t6_4,Nat,"5-Б",r37)],
                    "СР": [L("",t2_5,Chem,"8-Б",rOnl), L("",t4_5,Chem,"8-В",rOnl)],
                    "ЧТ": [L("",t2_5,Chem,"9-В",r40), L("",t3_5,Chem,"9-А",r40), L("",t4_5,Chem,"9-Б",r40), L("",t4_4,Zdor,"5-В",r36), L("",t5_4,Zdor,"5-А",r39)],
                    "ПТ": [L("",t1_5,Chem,"8-В",rOnl), L("",t2_5,Chem,"8-А",rOnl), L("",t3_5,Chem,"8-Б",rOnl), L("",t5_5,Ozn,"9-В",r40), L("",t6_5,Ozn,"9-А",r25_40), L("",t7_5,Ozn,"9-Б",r41)]
                },
                week2: {
                    "ПН": [L("",t2_4,Nat,"5-Б",r37), L("",t4_4,Nat,"5-А",r39), L("",t5_4,Nat,"5-В",r36)],
                    "ВТ": [L("",t4_5,Chem,"9-А",r40), L("",t5_5,Chem,"9-Б",r40), L("",t6_5,Chem,"9-В",r40), L("",t4_4,Nat,"5-В",r36), L("",t5_4,Nat,"5-А",r39), L("",t6_4,Nat,"5-Б",r37)],
                    "СР": [L("",t2_5,Chem,"8-Б",r33), L("",t4_5,Chem,"8-В",r30)],
                    "ЧТ": [L("",t2_5,Chem,"9-В",rOnl), L("",t3_5,Chem,"9-А",rOnl), L("",t4_5,Chem,"9-Б",rOnl), L("",t4_4,Zdor,"5-В",r36), L("",t5_4,Zdor,"5-А",r39)],
                    "ПТ": [L("",t1_5,Chem,"8-В",r30), L("",t2_5,Chem,"8-А",r35), L("",t3_5,Chem,"8-Б",r33), L("",t5_5,Ozn,"9-В",rOnl), L("",t6_5,Ozn,"9-А",rOnl), L("",t7_5,Ozn,"9-Б",rOnl)]
                }
            },
            "Атаманчук Олександр Євгенійович": {
                week1: {
                    "ПН": [L("",t1_5,PE,"8-А",rOnl), L("",t2_5,PE,"9-Б",rGym), L("",t3_5,PE,"8-Б",rOnl), L("",t4_5,PE,"9-В",rGym)],
                    "ВТ": [L("",t1_5,PE,"7-Б",rOnl), L("",t2_5,PE,"7-В",rOnl), L("",t3_5,PE,"8-Б",rOnl), L("",t6_5,PE,"8-А",rOnl)],
                    "СР": [L("",t3_5,PE,"9-В",rGym), L("",t5_5,PE,"9-Б",rGym), L("",t6_5,PE,"7-В",rOnl), L("",t7_5,PE,"7-Б",rOnl)],
                    "ЧТ": [L("",t3_5,PE,"8-А",rOnl), L("",t4_5,PE,"8-Б",rOnl), L("",t5_5,PE,"7-Б",rOnl), L("",t6_5,PE,"7-В",rOnl)],
                    "ПТ": [L("",t1_5,PE,"9-Б",rGym), L("",t2_5,PE,"9-В",rGym)]
                },
                week2: {
                    "ПН": [L("",t1_5,PE,"8-А",rGym), L("",t2_5,PE,"9-Б",rOnl), L("",t3_5,PE,"8-Б",rGym), L("",t4_5,PE,"9-В",rOnl)],
                    "ВТ": [L("",t1_5,PE,"7-Б",rGym), L("",t2_5,PE,"7-В",rGym), L("",t3_5,PE,"8-Б",rGym), L("",t6_5,PE,"8-А",rGym)],
                    "СР": [L("",t3_5,PE,"9-В",rOnl), L("",t5_5,PE,"9-Б",rOnl), L("",t6_5,PE,"7-В",rGym), L("",t7_5,PE,"7-Б",rGym)],
                    "ЧТ": [L("",t3_5,PE,"8-А",rGym), L("",t4_5,PE,"8-Б",rGym), L("",t5_5,PE,"7-Б",rGym), L("",t6_5,PE,"7-В",rGym)],
                    "ПТ": [L("",t1_5,PE,"9-Б",rOnl), L("",t2_5,PE,"9-В",rOnl)]
                }
            },
            "Бабич Світлана Євгеніївна": dupW({
                "ПН": [L("",t1_2,L_subj,"2-В",r5), L("",t3_2,M,"2-В",r5), L("",t4_2,U,"2-В",r5), L("",t5_2,Y,"2-В",r5)],
                "ВТ": [L("",t1_2,L_subj,"2-В",r5), L("",t2_2,U,"2-В",r5), L("",t3_2,M,"2-В",r5), L("",t4_2,PE,"2-В",rGym)],
                "СР": [L("",t2_2,M,"2-В",r5), L("",t3_2,U,"2-В",r5), L("",t4_2,I,"2-В",r20), L("",t5_2,D,"2-В",r5)],
                "ЧТ": [L("",t1_2,U,"2-В",r5), L("",t3_2,M,"2-В",r5), L("",t4_2,Y,"2-В",r5), L("",t5_2,PE,"2-В",rGym)],
                "ПТ": [L("",t1_2,L_subj,"2-В",r5), L("",t2_2,Y,"2-В",r5), L("",t3_2,A,"2-В",r5), L("",t4_2,PE,"2-В",rGym)]
            }),
            "Бєлова Тетяна Леонідівна": dupW({
                "ПН": [L("",t1_2,E,"2-Б",r22), L("",t2_2,E,"2-В",r5), L("",t1_3,E,"4-Б",r5), L("",t2_3,E,"4-В",r23), L("",t3_3,E,"3-А",r2), L("",t4_3,E,"4-А",r22)],
                "ВТ": [L("",t1_1,E,"1-А",r4), L("",t2_1,E,"1-Б",r2), L("",t1_3,E,"4-Б",r5)],
                "СР": [L("",t1_2,E,"2-В",r5), L("",t2_2,E,"2-Б",r22), L("",t1_3,E,"3-А",r2), L("",t2_3,E,"4-В",r23), L("",t3_3,E,"4-А",r22)],
                "ЧТ": [L("",t1_2,E,"2-Б",r22), L("",t2_2,E,"2-В",r5), L("",t1_3,E,"4-Б",r5), L("",t2_3,E,"4-В",r23), L("",t3_3,E,"4-А",r22)],
                "ПТ": [L("",t1_1,E,"1-Б",r2), L("",t2_1,E,"1-А",r4), L("",t1_3,E,"3-А",r2)]
            }),
            "Бовсуновський Юрій Миколайович": {
                week1: {
                    "ПН": [L("",t5_2,PE,"2-Б",rGym), L("",t1_3,PE,"4-А",rGym)],
                    "ВТ": [L("",t6_5,PE,"7-А",rOnl)],
                    "СР": [L("",t3_5,PE,"7-А",rOnl), L("",t5_5,PE,"7-А",rOnl), L("",t4_2,PE,"2-Б",rGym), L("",t2_3,PE,"4-А",rGym)],
                    "ЧТ": [L("",t5_5,PE,"7-А",rOnl), L("",t4_2,PE,"2-Б",rGym), L("",t2_3,PE,"4-А",rGym)],
                    "ПТ": []
                },
                week2: {
                    "ПН": [L("",t5_2,PE,"2-Б",rGym), L("",t1_3,PE,"4-А",rGym)],
                    "ВТ": [L("",t6_5,PE,"7-А",rGym)],
                    "СР": [L("",t3_5,PE,"7-А",r39), L("",t4_2,PE,"2-Б",rGym), L("",t5_5,PE,"7-А",rGym), L("",t2_3,PE,"4-А",rGym)],
                    "ЧТ": [L("",t4_2,PE,"2-Б",rGym), L("",t5_5,PE,"7-А",rGym), L("",t2_3,PE,"4-А",rGym)],
                    "ПТ": []
                }
            },
            "Ваховська Наталія Сергіївна": {
                week1: {
                    "ПН": [L("",t4_5,E,"9-А",r33_34)],
                    "ВТ": [L("",t2_4,E,"6-Б",rOnl), L("",t4_4,E,"6-В",rOnl), L("",t5_4,E,"6-А",rOnl), L("",t6_4,E,"5-А",r39)],
                    "СР": [L("",t6_5,E,"9-А",r33_34), L("",t1_4,E,"6-В",rOnl), L("",t4_4,E,"6-Б",rOnl), L("",t5_4,E,"6-А",rOnl), L("",t6_4,E,"5-А",r39)],
                    "ЧТ": [L("",t3_4,E,"5-А",r39), L("",t4_4,E,"6-Б",rOnl), L("",t5_4,E,"6-А",rOnl), L("",t6_4,E,"6-В",rOnl)],
                    "ПТ": [L("",t1_4,I,"6-В",rOnl), L("",t1_4,E,"5-А",r39), L("",t3_4,E,"6-А",rOnl), L("",t4_4,E,"6-А",rOnl), L("",t5_4,E,"6-Б",rOnl)]
                },
                week2: {
                    "ПН": [L("",t4_5,E,"9-А",rOnl)],
                    "ВТ": [L("",t2_4,E,"6-Б",r30), L("",t4_4,E,"6-В",r34), L("",t5_4,E,"6-А",r33), L("",t6_4,E,"5-А",rOnl)],
                    "СР": [L("",t6_5,E,"9-А",rOnl), L("",t1_4,E,"6-В",r34), L("",t4_4,E,"6-Б",r30), L("",t5_4,E,"6-А",r33), L("",t6_4,E,"5-А",rOnl)],
                    "ЧТ": [L("",t3_4,E,"5-А",rOnl), L("",t4_4,E,"6-Б",r30), L("",t5_4,E,"6-А",r33), L("",t6_4,E,"6-В",r34)],
                    "ПТ": [L("",t1_4,I,"6-В",r20_26), L("",t1_4,E,"5-А",rOnl), L("",t3_4,E,"6-А",r33), L("",t4_4,E,"6-А",r33), L("",t5_4,E,"6-Б",r30)]
                }
            },
            "Вільчинська Ірина Леонідівна": {
                week1: {
                    "ПН": [],
                    "ВТ": [],
                    "СР": [L("",t5_5,I,"7-Б",rOnl), L("",t7_5,I,"7-А",rOnl), L("",t2_4,I,"5-А",r26_20), L("",t3_4,I,"5-В",r20_26), L("",t6_4,I,"5-Б",r20_26), L("",t6_3,I,"4-Б",r20_26)],
                    "ЧТ": [L("",t4_5,I,"8-А",rOnl), L("",t5_5,I,"7-В",rOnl), L("",t7_5,I,"8-Б",rOnl), L("",t4_3,I,"3-А",r26_20), L("",t5_3,I,"3-В",r20_26), L("",t6_3,I,"4-В",r26_20)],
                    "ПТ": [L("",t2_4,I,"6-Б",rOnl), L("",t3_4,I,"6-А",rOnl), L("",t1_3,I,"3-Б",r20_26), L("",t2_3,I,"4-А",r26_20)]
                },
                week2: {
                    "ПН": [],
                    "ВТ": [],
                    "СР": [L("",t5_5,I,"7-Б",r26_20), L("",t7_5,I,"7-А",r26_20), L("",t2_4,I,"5-А",rOnl), L("",t3_4,I,"5-В",rOnl), L("",t6_4,I,"5-Б",rOnl), L("",t6_3,I,"4-Б",r20_26)],
                    "ЧТ": [L("",t4_5,I,"8-А",r26_20), L("",t5_5,I,"7-В",r26_20), L("",t7_5,I,"8-Б",r20_26), L("",t4_3,I,"3-А",r26_20), L("",t5_3,I,"3-В",r20_26), L("",t6_3,I,"4-В",r26_20)],
                    "ПТ": [L("",t2_4,I,"6-Б",r26_20), L("",t3_4,I,"6-А",r20_26), L("",t1_3,I,"3-Б",r20_26), L("",t2_3,I,"4-А",r26_20)]
                }
            },
            "Горощенко Алла Матвіївна": {
                week1: {
                    "ПН": [L("",t4_5,Chem,"11-А",r40), L("",t5_5,Chem,"7-А",rOnl), L("",t6_5,Chem,"7-Б",rOnl), L("",t7_5,Chem,"7-В",rOnl)],
                    "ВТ": [],
                    "СР": [L("",t4_5,Chem,"10-А",r26), L("",t5_5,Chem,"10-А",r26), L("",t6_5,Chem,"11-А",r40)],
                    "ЧТ": [],
                    "ПТ": []
                },
                week2: {
                    "ПН": [L("",t4_5,Chem,"11-А",rOnl), L("",t5_5,Chem,"7-А",r41), L("",t6_5,Chem,"7-Б",r41), L("",t7_5,Chem,"7-В",r41)],
                    "ВТ": [],
                    "СР": [L("",t5_5,Chem,"10-А",rOnl), L("",t6_5,Chem,"11-А",rOnl)],
                    "ЧТ": [],
                    "ПТ": []
                }
            },
            "Господарик Олександра Іванівна": dupW({
                "ПН": [L("",t2_2,M,"2-Б",r22), L("",t3_2,U,"2-Б",r22), L("",t4_2,Y,"2-Б",r22)],
                "ВТ": [L("",t1_2,U,"2-Б",r22), L("",t2_2,I,"2-Б",r20), L("",t3_2,M,"2-Б",r22), L("",t4_2,L_subj,"2-Б",r22), L("",t5_2,D,"2-Б",r22)],
                "СР": [L("",t1_2,U,"2-Б",r22), L("",t3_2,M,"2-Б",r22), L("",t5_2,Y,"2-Б",r22)],
                "ЧТ": [L("",t2_2,M,"2-Б",r22), L("",t3_2,L_subj,"2-Б",r22)],
                "ПТ": [L("",t1_2,U,"2-Б",r22), L("",t2_2,L_subj,"2-Б",r22), L("",t3_2,Y,"2-Б",r22), L("",t4_2,A,"2-Б",r22)]
            }),
            "Гребенюк Ірина Дмитрівна": {
                week1: {
                    "ПН": [L("",t2_5,E,"8-В",rOnl), L("",t3_5,E,"8-А",rOnl), L("",t4_5,E,"8-Б",rOnl), L("",t5_5,E,"9-Б",r41), L("",t7_5,E,"9-В",r40)],
                    "ВТ": [L("",t4_5,E,"8-Б",rOnl), L("",t5_4,E,"5-В",r36)],
                    "СР": [L("",t1_5,E,"9-В",r40), L("",t2_5,E,"8-А",rOnl), L("",t6_5,E,"8-Б",rOnl), L("",t7_5,E,"9-Б",r41), L("",t5_4,E,"5-В",r36)],
                    "ЧТ": [L("",t5_5,E,"8-В",rOnl), L("",t6_5,E,"8-Б",rOnl), L("",t7_5,E,"8-А",rOnl), L("",t5_4,E,"5-В",r36)],
                    "ПТ": [L("",t3_4,E,"5-В",r36)]
                },
                week2: {
                    "ПН": [L("",t2_5,E,"8-В",r30), L("",t3_5,E,"8-А",r35), L("",t4_5,E,"8-Б",r33), L("",t5_5,E,"9-Б",rOnl), L("",t7_5,E,"9-В",rOnl)],
                    "ВТ": [L("",t4_5,E,"8-Б",r33), L("",t5_4,E,"5-В",rOnl)],
                    "СР": [L("",t1_5,E,"9-В",rOnl), L("",t2_5,E,"8-А",r35), L("",t6_5,E,"8-Б",r33), L("",t7_5,E,"9-Б",rOnl), L("",t5_4,E,"5-В",rOnl)],
                    "ЧТ": [L("",t5_5,E,"8-В",r30), L("",t6_5,E,"8-Б",r33), L("",t7_5,E,"8-А",r35), L("",t5_4,E,"5-В",rOnl)],
                    "ПТ": [L("",t3_4,E,"5-В",rOnl)]
                }
            },
            "Данілова Світлана Володимирівна": {
                week1: {
                    "ПН": [],
                    "ВТ": [L("",t1_5,Geo,"8-В",rOnl), L("",t2_5,Geo,"11-А",r34), L("",t3_5,Geo,"7-В",rOnl), L("",t4_5,Geo,"7-А",rOnl), L("",t5_5,Geo,"7-Б",rOnl)],
                    "СР": [],
                    "ЧТ": [L("",t1_5,Geo,"7-А",rOnl), L("",t2_5,Geo,"7-Б",rOnl), L("",t3_5,Geo,"7-В",rOnl), L("",t4_5,Geo,"8-В",rOnl)],
                    "ПТ": []
                },
                week2: {
                    "ПН": [],
                    "ВТ": [L("",t1_5,Geo,"8-В",r30), L("",t2_5,Geo,"11-А",rOnl), L("",t3_5,Geo,"7-В",r36), L("",t4_5,Geo,"7-А",r39), L("",t5_5,Geo,"7-Б",r37)],
                    "СР": [],
                    "ЧТ": [L("",t1_5,Geo,"7-А",r39), L("",t2_5,Geo,"7-Б",r37), L("",t3_5,Geo,"7-В",r36), L("",t4_5,Geo,"8-В",r30)],
                    "ПТ": []
                }
            },
            "Дідко Ірина Станіславівна": {
                week1: {
                    "ПН": [L("",t6_5,U,"8-А",rOnl), L("",t7_5,ULit,"5-В",r36), L("",t3_4,U,"5-В",r36)],
                    "ВТ": [L("",t1_5,U,"8-А",rOnl), L("",t3_5,ULit,"9-А",r25), L("",t4_5,ULit,"9-Б",r40), L("",t7_5,U,"9-Б",r41), L("",t2_4,U,"5-В",r36)],
                    "СР": [L("",t5_5,U,"9-А",r25), L("",t6_5,ULit,"8-А",rOnl), L("",t7_5,U,"9-В",r40), L("",t2_4,U,"5-В",r36)],
                    "ЧТ": [L("",t4_5,U,"9-В",r40), L("",t6_5,U,"8-А",rOnl), L("",t7_5,U,"9-А",r25), L("",t2_4,U,"5-В",r36)],
                    "ПТ": [L("",t2_5,U,"9-Б",r41), L("",t3_5,ULit,"8-А",rOnl), L("",t4_5,ULit,"9-А",r25), L("",t6_5,ULit,"9-В",r40), L("",t7_5,ULit,"5-В",r36)]
                },
                week2: {
                    "ПН": [L("",t6_5,U,"8-А",r35), L("",t1_4,ULit,"5-В",rOnl), L("",t3_4,U,"5-В",rOnl)],
                    "ВТ": [L("",t1_5,U,"8-А",r35), L("",t3_5,ULit,"9-А",rOnl), L("",t4_5,ULit,"9-Б",rOnl), L("",t1_4,U,"9-Б",rOnl), L("",t2_4,U,"5-В",rOnl)],
                    "СР": [L("",t5_5,U,"9-А",rOnl), L("",t6_5,ULit,"8-А",r35), L("",t1_4,U,"9-В",rOnl), L("",t2_4,U,"5-В",rOnl)],
                    "ЧТ": [L("",t4_5,U,"9-В",rOnl), L("",t6_5,U,"8-А",r35), L("",t1_4,U,"9-А",rOnl), L("",t2_4,U,"5-В",rOnl)],
                    "ПТ": [L("",t2_5,U,"9-Б",rOnl), L("",t3_5,ULit,"8-А",r35), L("",t4_5,ULit,"9-А",rOnl), L("",t6_5,ULit,"9-В",rOnl), L("",t1_4,ULit,"5-В",rOnl)]
                }
            },
            "Дудар Оксана Василівна": {
                week1: {
                    "ПН": [L("",t3_5,HistU,"8-В",rOnl), L("",t4_5,HistU,"8-А",rOnl), L("",t5_5,HistU,"9-В",r40), L("",t6_5,HistU,"8-Б",rOnl), L("",t7_5,HistU,"9-Б",r41)],
                    "ВТ": [L("",t1_5,HistU,"9-В",r40), L("",t2_5,HistU,"9-Б",r41), L("",t4_5,HistU,"10-А",r26), L("",t6_5,Grom,"7-Б",rOnl), L("",t7_5,Grom,"7-А",rOnl)],
                    "СР": [L("",t1_5,HistU,"8-Б",rOnl), L("",t3_5,HistU,"8-А",rOnl), L("",t6_5,HistU,"10-А",r26), L("",t7_5,HistU,"8-В",rOnl)],
                    "ЧТ": [L("",t1_5,HistU,"7-Б",rOnl), L("",t2_5,HistU,"7-А",rOnl), L("",t4_5,HistU,"7-В",rOnl), L("",t5_5,HistU,"10-А",r26)],
                    "ПТ": [L("",t1_5,HistU,"7-Б",rOnl), L("",t2_5,HistU,"7-А",rOnl), L("",t3_5,HistU,"7-В",rOnl), L("",t4_5,Grom,"8-В",rOnl), L("",t5_5,Grom,"8-А",rOnl)]
                },
                week2: {
                    "ПН": [L("",t3_5,HistU,"8-В",r30), L("",t4_5,HistU,"8-А",r35), L("",t5_5,HistU,"9-В",rOnl), L("",t6_5,HistU,"8-Б",r33), L("",t7_5,HistU,"9-Б",rOnl)],
                    "ВТ": [L("",t1_5,HistU,"9-В",rOnl), L("",t2_5,HistU,"9-Б",rOnl), L("",t4_5,HistU,"10-А",rOnl), L("",t7_5,Grom,"7-В",r36)],
                    "СР": [L("",t1_5,HistU,"8-Б",r33), L("",t3_5,HistU,"8-А",r35), L("",t7_5,HistU,"8-В",r30)],
                    "ЧТ": [L("",t1_5,HistU,"7-Б",r37), L("",t2_5,HistU,"7-А",r39), L("",t4_5,HistU,"7-В",r36), L("",t5_5,HistU,"10-А",rOnl)],
                    "ПТ": [L("",t1_5,HistU,"7-Б",r37), L("",t2_5,HistU,"7-А",r39), L("",t3_5,HistU,"7-В",r36), L("",t4_5,Grom,"8-В",r30), L("",t5_5,Grom,"8-А",r35)]
                }
            },
            "Євтушенко Тетяна Стефанівна": {
                week1: {
                    "ПН": [L("",t3_1,E,"1-В",r24), L("",t2_1,E,"2-А",r23), L("",t1_3,E,"4-Б",r5), L("",t2_3,E,"3-В",r24), L("",t3_3,E,"3-А",r2), L("",t4_3,E,"3-Б",r4)],
                    "ВТ": [L("",t2_4,E,"6-Б",rOnl), L("",t1_3,E,"4-Б",r5)],
                    "СР": [L("",t5_5,Nim,"9-В",r40), L("",t4_4,E,"6-Б",rOnl), L("",t1_3,E,"3-А",r2), L("",t2_3,E,"3-В",r24), L("",t3_3,E,"3-Б",r4)],
                    "ЧТ": [L("",t4_4,E,"6-Б",rOnl), L("",t3_2,E,"2-А",r23), L("",t1_3,E,"4-Б",r5), L("",t4_3,E,"3-В",r24)],
                    "ПТ": [L("",t7_5,Nim,"9-В",r40), L("",t5_4,E,"6-Б",rOnl), L("",t2_1,E,"1-В",r24), L("",t3_2,E,"2-А",r23), L("",t1_3,E,"3-А",r2), L("",t5_3,E,"3-Б",r4)]
                },
                week2: {
                    "ПН": [L("",t3_1,E,"1-В",r24), L("",t2_1,E,"2-А",r23), L("",t1_3,E,"4-Б",r5), L("",t2_3,E,"3-В",r24), L("",t3_3,E,"3-А",r2), L("",t4_3,E,"3-Б",r4)],
                    "ВТ": [L("",t2_4,E,"6-Б",r30), L("",t1_3,E,"4-Б",r5)],
                    "СР": [L("",t5_5,Nim,"9-В",rOnl), L("",t4_4,E,"6-Б",r30), L("",t1_3,E,"3-А",r2), L("",t2_3,E,"3-В",r24), L("",t3_3,E,"3-Б",r4)],
                    "ЧТ": [L("",t4_4,E,"6-Б",r30), L("",t3_2,E,"2-А",r23), L("",t1_3,E,"4-Б",r5), L("",t4_3,E,"3-В",r24)],
                    "ПТ": [L("",t7_5,Nim,"9-В",rOnl), L("",t5_4,E,"6-Б",r30), L("",t2_1,E,"1-В",r24), L("",t3_2,E,"2-А",r23), L("",t1_3,E,"3-А",r2), L("",t5_3,E,"3-Б",r4)]
                }
            },
            "Желяк Лариса Василівна": dupW({
                "ПН": [L("",t1_3,U,"4-В",r23), L("",t3_3,M,"4-В",r23), L("",t4_3,L_subj,"4-В",r23), L("",t5_3,PE,"4-В",rGym)],
                "ВТ": [L("",t1_3,U,"4-В",r23), L("",t2_3,M,"4-В",r23), L("",t3_3,Y,"4-В",r23), L("",t4_3,D,"4-В",r23), L("",t5_3,PE,"4-В",rGym)],
                "СР": [L("",t1_3,L_subj,"4-В",r23), L("",t3_3,M,"4-В",r23), L("",t4_3,U,"4-В",r23)],
                "ЧТ": [L("",t1_3,U,"4-В",r23), L("",t3_3,M,"4-В",r23), L("",t4_3,Y,"4-В",r23), L("",t5_3,A,"4-В",r23), L("",t6_3,I,"4-В",r26_20)],
                "ПТ": [L("",t1_3,M,"4-В",r23), L("",t2_3,L_subj,"4-В",r23), L("",t3_3,Y,"4-В",r23), L("",t4_3,PE,"4-В",rGym)]
            }),
            "Жембровський Олексій Олександрович": {
                week1: {
                    "ПН": [L("",t1_5,I,"9-В",r26_20), L("",t3_5,I,"9-Б",r26_20), L("",t5_5,I,"11-А",r26_20), L("",t6_5,I,"10-А",r26_20), L("",t7_5,I,"9-А",r26_20)],
                    "ВТ": [],
                    "СР": [L("",t5_5,I,"7-Б",rOnl), L("",t7_5,I,"7-А",rOnl), L("",t2_4,I,"5-А",r26_20), L("",t3_4,I,"5-В",r20_26), L("",t6_4,I,"5-Б",r20_26)],
                    "ЧТ": [L("",t1_5,I,"9-В",r26_20), L("",t2_5,I,"9-Б",r20_26), L("",t3_5,I,"8-Б",rOnl), L("",t4_5,I,"8-А",rOnl)],
                    "ПТ": [L("",t1_5,Pidpr,"8-А",rOnl), L("",t3_5,I,"9-А",r26_20), L("",t6_5,I,"8-Б",rOnl), L("",t6_5,Pidpr,"8-В",rOnl)]
                },
                week2: {
                    "ПН": [L("",t1_5,I,"9-В",rOnl), L("",t3_5,I,"9-Б",rOnl), L("",t5_5,I,"11-А",rOnl), L("",t6_5,I,"10-А",rOnl), L("",t7_5,I,"9-А",rOnl)],
                    "ВТ": [],
                    "СР": [L("",t5_5,I,"7-Б",r26_20), L("",t7_5,I,"7-А",r26_20), L("",t2_4,I,"5-А",rOnl), L("",t3_4,I,"5-В",rOnl), L("",t6_4,I,"5-Б",rOnl)],
                    "ЧТ": [L("",t1_5,I,"9-В",rOnl), L("",t2_5,I,"9-Б",rOnl), L("",t3_5,I,"8-Б",r20_26), L("",t5_5,I,"7-В",r26_20)],
                    "ПТ": [L("",t3_5,I,"9-А",rOnl), L("",t6_5,I,"8-Б",rOnl), L("",t1_4,I,"6-В",r20_26), L("",t2_4,I,"6-Б",r26_20), L("",t3_4,I,"6-А",rOnl)]
                }
            },
            "Катріч Людмила Олександрівна": {
                week1: {
                    "ПН": [L("",t5_5,Grom,"10-А",r26), L("",t6_5,HistW,"9-А",r25), L("",t7_5,HistU,"11-А",r34), L("",t4_4,Hist,"6-В",rOnl), L("",t5_4,Hist,"6-А",rOnl), L("",t6_4,Hist,"6-Б",rOnl)],
                    "ВТ": [L("",t4_5,Prav,"9-Б",r41), L("",t5_5,Prav,"9-В",r40), L("",t6_5,Prav,"9-А",r25), L("",t7_5,HistW,"9-А",r25), L("",t4_4,Grom,"6-Б",rOnl), L("",t5_4,Grom,"6-В",rOnl), L("",t6_4,Grom,"6-А",rOnl)],
                    "СР": [L("",t6_5,Hist,"6-Б",rOnl), L("",t7_5,HistW,"9-А",r25), L("",t4_4,Hist,"6-А",rOnl), L("",t5_4,Hist,"6-В",rOnl)],
                    "ЧТ": [],
                    "ПТ": [L("",t3_5,HistU,"11-А",r34), L("",t4_5,Grom,"10-А",r26), L("",t3_4,Hist,"5-Б",r37), L("",t4_4,Hist,"5-А",r39), L("",t5_4,Hist,"5-В",r36)]
                },
                week2: {
                    "ПН": [L("",t5_5,Grom,"10-А",rOnl), L("",t6_5,HistW,"9-А",rOnl), L("",t7_5,HistU,"11-А",rOnl), L("",t4_4,Hist,"6-В",r34), L("",t5_4,Hist,"6-А",r33), L("",t6_4,Hist,"6-Б",r30)],
                    "ВТ": [L("",t4_5,Prav,"9-Б",r41), L("",t5_5,Prav,"9-В",r40), L("",t6_5,Prav,"9-А",r25), L("",t7_5,HistW,"9-А",rOnl), L("",t4_4,Grom,"6-Б",rOnl), L("",t5_4,Grom,"6-В",rOnl), L("",t6_4,Grom,"6-А",r33)],
                    "СР": [L("",t6_5,Hist,"6-Б",rOnl), L("",t7_5,HistW,"9-А",r25), L("",t4_4,Hist,"6-А",rOnl), L("",t5_4,Hist,"6-В",rOnl)],
                    "ЧТ": [],
                    "ПТ": [L("",t3_5,HistU,"11-А",rOnl), L("",t4_5,Grom,"10-А",r26), L("",t3_4,Hist,"5-Б",rOnl), L("",t4_4,Hist,"5-А",rOnl), L("",t5_4,Hist,"5-В",rOnl)]
                }
            },
            "Климчук Олена Леонідівна": dupW({
                "ПН": [L("",t2_3,M,"4-А",r22), L("",t3_3,U,"4-А",r22), L("",t5_3,A,"4-А",r22)],
                "ВТ": [L("",t1_3,L_subj,"4-А",r22), L("",t2_3,M,"4-А",r22), L("",t3_3,U,"4-А",r22), L("",t4_3,Y,"4-А",r22), L("",t5_3,Y,"4-А",r22)],
                "СР": [L("",t1_3,M,"4-А",r22), L("",t4_3,L_subj,"4-А",r22), L("",t5_3,D,"4-А",r22)],
                "ЧТ": [L("",t1_3,M,"4-А",r22), L("",t4_3,U,"4-А",r22), L("",t5_3,Y,"4-А",r22)],
                "ПТ": [L("",t1_3,U,"4-А",r22), L("",t2_3,I,"4-А",r26_20), L("",t3_3,M,"4-А",r22), L("",t4_3,L_subj,"4-А",r22)]
            }),
            "Кобернік Дар'я Ігорівна": {
                week1: {
                    "ПН": [],
                    "ВТ": [L("",t5_5,Geo,"8-А",rOnl), L("",t6_5,Geo,"6-А",rOnl), L("",t7_5,Geo,"8-Б",rOnl), L("",t2_4,Geo,"6-В",rOnl), L("",t6_4,Geo,"6-Б",rOnl)],
                    "СР": [L("",t2_5,Geo,"9-Б",r41), L("",t6_5,Geo,"9-В",r40), L("",t4_4,Geo,"6-В",rOnl), L("",t5_4,Geo,"6-Б",rOnl), L("",t6_4,Geo,"6-А",rOnl)],
                    "ЧТ": [L("",t1_5,Geo,"8-А",rOnl), L("",t2_5,Geo,"8-Б",rOnl), L("",t3_5,Geo,"9-Б",r41), L("",t4_5,Geo,"9-А",r25), L("",t5_5,Geo,"9-В",r40)],
                    "ПТ": []
                },
                week2: {
                    "ПН": [],
                    "ВТ": [L("",t5_5,Geo,"8-А",r35), L("",t6_5,Geo,"6-А",r33), L("",t7_5,Geo,"8-Б",r33), L("",t2_4,Geo,"6-В",r34), L("",t6_4,Geo,"6-Б",r30)],
                    "СР": [L("",t2_5,Geo,"9-Б",rOnl), L("",t6_5,Geo,"9-В",rOnl), L("",t4_4,Geo,"6-В",r34), L("",t5_4,Geo,"6-Б",r30), L("",t6_4,Geo,"6-А",r33)],
                    "ЧТ": [L("",t1_5,Geo,"8-А",r35), L("",t2_5,Geo,"8-Б",r33), L("",t3_5,Geo,"9-Б",rOnl), L("",t4_5,Geo,"9-А",rOnl), L("",t5_5,Geo,"9-В",rOnl)],
                    "ПТ": []
                }
            },
            "Ковальчук Володимир Вікторович": {
                week1: {
                    "ПН": [L("",t5_5,Alg,"7-Б",rOnl)],
                    "ВТ": [L("",t2_5,Geom,"7-Б",rOnl)],
                    "СР": [L("",t3_5,Alg,"7-Б",rOnl)],
                    "ЧТ": [L("",t3_5,Geom,"7-Б",rOnl)],
                    "ПТ": [L("",t5_5,Alg,"7-Б",rOnl)]
                },
                week2: {
                    "ПН": [L("",t5_5,Alg,"7-Б",r37)],
                    "ВТ": [L("",t2_5,Geom,"7-Б",r37)],
                    "СР": [L("",t3_5,Alg,"7-Б",r37)],
                    "ЧТ": [L("",t3_5,Geom,"7-Б",r37)],
                    "ПТ": [L("",t5_5,Alg,"7-Б",r37)]
                }
            },
            "Козел Тетяна Юріївна": {
                week1: {
                    "ПН": [L("",t4_5,ULit,"7-Б",rOnl), L("",t5_5,U,"8-Б",rOnl), L("",t6_5,U,"8-В",rOnl), L("",t2_4,U,"6-А",rOnl)],
                    "ВТ": [L("",t5_5,U,"8-Б",rOnl), L("",t6_5,U,"8-В",rOnl), L("",t7_5,U,"7-Б",rOnl), L("",t2_4,U,"6-А",rOnl), L("",t3_4,ULit,"6-А",rOnl)],
                    "СР": [L("",t6_5,U,"7-Б",rOnl), L("",t1_4,ULit,"6-А",rOnl), L("",t3_4,U,"6-А",rOnl)],
                    "ЧТ": [L("",t4_5,ULit,"7-Б",rOnl), L("",t5_5,U,"8-Б",rOnl), L("",t6_5,U,"8-В",rOnl), L("",t1_4,U,"6-А",rOnl)],
                    "ПТ": [L("",t1_5,ULit,"8-Б",rOnl), L("",t2_5,ULit,"8-В",rOnl), L("",t3_5,U,"7-Б",rOnl)]
                },
                week2: {
                    "ПН": [L("",t4_5,ULit,"7-Б",r37), L("",t5_5,U,"8-Б",r33), L("",t6_5,U,"8-В",r30), L("",t2_4,U,"6-А",r33)],
                    "ВТ": [L("",t5_5,U,"8-Б",r33), L("",t6_5,U,"8-В",r30), L("",t7_5,U,"7-Б",r37), L("",t2_4,U,"6-А",r33), L("",t3_4,ULit,"6-А",r33)],
                    "СР": [L("",t6_5,U,"7-Б",r37), L("",t1_4,ULit,"6-А",r33), L("",t3_4,U,"6-А",r33)],
                    "ЧТ": [L("",t4_5,ULit,"7-Б",r37), L("",t5_5,U,"8-Б",r33), L("",t6_5,U,"8-В",r30), L("",t1_4,U,"6-А",r33)],
                    "ПТ": [L("",t1_5,ULit,"8-Б",r33), L("",t2_5,ULit,"8-В",r30), L("",t3_5,U,"7-Б",r37)]
                }
            },
            "Кочевенко Денис Миколайович": {
                week1: {
                    "ПН": [],
                    "ВТ": [L("",t2_5,STEM,"8-В",rOnl), L("",t3_5,STEM,"8-А",rOnl)],
                    "СР": [L("",t3_5,STEM,"7-В",rOnl)],
                    "ЧТ": [],
                    "ПТ": []
                },
                week2: {
                    "ПН": [],
                    "ВТ": [L("",t2_5,STEM,"8-В",r30), L("",t3_5,STEM,"8-А",r35)],
                    "СР": [L("",t3_5,STEM,"7-В",r36)],
                    "ЧТ": [],
                    "ПТ": []
                }
            },
            "Кузнецова Олена Вячеславівна": {
                week1: {
                    "ПН": [L("",t1_5,E,"7-В",rOnl), L("",t2_5,E,"7-А",rOnl), L("",t3_5,E,"7-Б",rOnl), L("",t4_5,E,"9-А",r33_34)],
                    "ВТ": [L("",t1_5,E,"7-А",rOnl), L("",t3_5,E,"7-Б",rOnl), L("",t4_5,E,"7-В",rOnl), L("",t6_5,E,"11-А",r34), L("",t2_4,E,"5-Б",r37)],
                    "СР": [L("",t6_5,E,"9-А",r33_34), L("",t7_5,E,"10-А",r26), L("",t4_4,E,"5-Б",r37)],
                    "ЧТ": [L("",t4_5,E,"10-А",r26), L("",t6_5,E,"11-А",r34), L("",t1_4,E,"5-Б",r37)],
                    "ПТ": [L("",t4_5,E,"7-А",rOnl), L("",t5_5,E,"7-Б",rOnl), L("",t6_5,E,"7-В",rOnl), L("",t2_4,E,"5-Б",r37)]
                },
                week2: {
                    "ПН": [L("",t1_5,E,"7-В",r36), L("",t2_5,E,"7-А",r39), L("",t3_5,E,"7-Б",r37), L("",t4_5,E,"9-А",rOnl)],
                    "ВТ": [L("",t1_5,E,"7-А",r39), L("",t3_5,E,"7-Б",r37), L("",t4_5,E,"7-В",r36), L("",t6_5,E,"11-А",rOnl), L("",t2_4,E,"5-Б",r37)],
                    "СР": [L("",t6_5,E,"9-А",rOnl), L("",t7_5,E,"10-А",rOnl), L("",t4_4,E,"5-Б",r37)],
                    "ЧТ": [L("",t4_5,E,"10-А",rOnl), L("",t6_5,E,"11-А",rOnl), L("",t1_4,E,"5-Б",r37)],
                    "ПТ": [L("",t4_5,E,"7-А",r39), L("",t5_5,E,"7-Б",r37), L("",t6_5,E,"7-В",r36), L("",t2_4,E,"5-Б",r37)]
                }
            },
            "Лавриненко Наталія Вілівна": {
                week1: {
                    "ПН": [L("",t1_5,Phys,"9-Б",r41), L("",t2_5,Phys,"9-А",r39), L("",t3_5,Phys,"9-В",r40)],
                    "ВТ": [L("",t1_5,Phys,"9-Б",r41), L("",t2_5,Phys,"9-А",r39), L("",t3_5,Phys,"9-В",r40)],
                    "СР": [],
                    "ЧТ": [],
                    "ПТ": [L("",t1_5,Phys,"9-В",r40), L("",t2_5,Phys,"9-А",r39_25), L("",t3_5,Phys,"9-Б",r41)]
                },
                week2: {
                    "ПН": [L("",t1_5,Phys,"9-Б",rOnl), L("",t2_5,Phys,"9-А",rOnl), L("",t3_5,Phys,"9-В",rOnl)],
                    "ВТ": [L("",t1_5,Phys,"9-Б",rOnl), L("",t2_5,Phys,"9-А",rOnl), L("",t3_5,Phys,"9-В",rOnl)],
                    "СР": [],
                    "ЧТ": [],
                    "ПТ": [L("",t1_5,Phys,"9-В",rOnl), L("",t2_5,Phys,"9-А",rOnl), L("",t3_5,Phys,"9-Б",rOnl)]
                }
            },
            "Ладнюк Олена Валеріївна": {
                week1: {
                    "ПН": [L("",t5_5,Pol,"8-В",rOnl), L("",t6_5,Pol,"7-В",rOnl), L("",t1_4,Pol,"5-Б",r37), L("",t2_4,Pol,"6-Б",rOnl)],
                    "ВТ": [],
                    "СР": [L("",t1_5,Pol,"9-Б",r41), L("",t2_5,Pol,"7-В",rOnl), L("",t3_5,Pol,"8-В",rOnl), L("",t4_5,Pol,"9-А",r25), L("",t0_4,Pol,"6-А",rOnl)],
                    "ЧТ": [],
                    "ПТ": [L("",t6_5,Pol,"9-Б",r41), L("",t7_5,Pol,"9-А",r25), L("",t4_4,Pol,"6-Б",rOnl), L("",t5_4,Pol,"5-Б",r37), L("",t6_4,Pol,"6-А",rOnl)]
                },
                week2: {
                    "ПН": [L("",t5_5,Pol,"8-В",r30), L("",t6_5,Pol,"7-В",r36), L("",t1_4,Pol,"5-Б",r37), L("",t2_4,Pol,"6-Б",r30)],
                    "ВТ": [],
                    "СР": [L("",t1_5,Pol,"9-Б",rOnl), L("",t2_5,Pol,"7-В",r36), L("",t3_5,Pol,"8-В",r30), L("",t4_5,Pol,"9-А",rOnl), L("",t0_4,Pol,"6-А",r33)],
                    "ЧТ": [],
                    "ПТ": [L("",t6_5,Pol,"9-Б",rOnl), L("",t7_5,Pol,"9-А",rOnl), L("",t4_4,Pol,"6-Б",r30), L("",t5_4,Pol,"5-Б",r37), L("",t6_4,Pol,"6-А",r33)]
                }
            },
            "Максимець Наталя Федорівна": {
                week1: {
                    "ПН": [L("",t1_4,ULit,"5-А",r39), L("",t3_4,U,"6-Б",rOnl), L("",t4_4,U,"5-Б",r37), L("",t5_4,ULit,"5-Б",r37), L("",t6_4,U,"5-А",r39)],
                    "ВТ": [L("",t0_4,U,"6-Б",rOnl), L("",t1_4,U,"5-А",r39), L("",t3_4,ULit,"6-Б",rOnl), L("",t4_4,U,"5-Б",r37)],
                    "СР": [L("",t6_5,ULit,"9-Б",r41), L("",t2_4,ULit,"6-Б",rOnl), L("",t3_4,U,"6-Б",rOnl), L("",t4_4,U,"5-А",r39), L("",t5_4,U,"5-Б",r37)],
                    "ЧТ": [L("",t5_5,ULit,"9-Б",r41), L("",t1_4,U,"6-Б",rOnl), L("",t2_4,U,"5-А",r39), L("",t3_4,U,"5-Б",r37)],
                    "ПТ": [L("",t4_4,ULit,"5-Б",r37), L("",t5_4,ULit,"5-А",r39)]
                },
                week2: {
                    "ПН": [L("",t1_4,ULit,"5-А",r39), L("",t3_4,U,"6-Б",r30), L("",t4_4,U,"5-Б",r37), L("",t5_4,ULit,"5-Б",r37), L("",t6_4,U,"5-А",r39)],
                    "ВТ": [L("",t0_4,U,"6-Б",r30), L("",t1_4,U,"5-А",r39), L("",t3_4,ULit,"6-Б",r30), L("",t4_4,U,"5-Б",r37)],
                    "СР": [L("",t6_5,ULit,"9-Б",rOnl), L("",t2_4,ULit,"6-Б",r30), L("",t3_4,U,"6-Б",r30), L("",t4_4,U,"5-А",r39), L("",t5_4,U,"5-Б",r37)],
                    "ЧТ": [L("",t5_5,ULit,"9-Б",rOnl), L("",t1_4,U,"6-Б",r30), L("",t2_4,U,"5-А",r39), L("",t3_4,U,"5-Б",r37)],
                    "ПТ": [L("",t4_4,ULit,"5-Б",r37), L("",t5_4,ULit,"5-А",r39)]
                }
            },
            "Максимчук Любов Петрівна": {
                week1: {
                    "ПН": [L("",t1_5,Alg,"8-Б",rOnl), L("",t2_4,M,"5-В",r36), L("",t4_4,M,"6-А",rOnl)],
                    "ВТ": [L("",t1_5,Geom,"8-Б",rOnl), L("",t1_4,M,"6-А",rOnl), L("",t3_4,M,"5-В",r36)],
                    "СР": [L("",t4_5,Alg,"8-Б",rOnl), L("",t1_4,M,"5-В",r36), L("",t2_4,M,"6-А",rOnl)],
                    "ЧТ": [L("",t3_5,Geom,"8-Б",rOnl), L("",t1_4,M,"5-В",r36), L("",t3_4,M,"6-А",rOnl)],
                    "ПТ": [L("",t4_5,Alg,"8-Б",rOnl), L("",t1_4,M,"6-А",rOnl), L("",t2_4,M,"5-В",r36)]
                },
                week2: {
                    "ПН": [L("",t1_5,Alg,"8-Б",r33), L("",t2_4,M,"5-В",r36), L("",t4_4,M,"6-А",r33)],
                    "ВТ": [L("",t1_5,Geom,"8-Б",r33), L("",t1_4,M,"6-А",r33), L("",t3_4,M,"5-В",r36)],
                    "СР": [L("",t4_5,Alg,"8-Б",r33), L("",t1_4,M,"5-В",r36), L("",t2_4,M,"6-А",r33)],
                    "ЧТ": [L("",t3_5,Geom,"8-Б",r33), L("",t1_4,M,"5-В",r36), L("",t3_4,M,"6-А",r33)],
                    "ПТ": [L("",t4_5,Alg,"8-Б",r33), L("",t1_4,M,"6-А",r33), L("",t2_4,M,"5-В",r36)]
                }
            },
            "Манохін Володимир Володимирович": {
                week1: {
                    "ПН": [],
                    "ВТ": [L("",t5_5,Zakh,"11-А",rZakh)],
                    "СР": [],
                    "ЧТ": [L("",t5_5,Zakh,"11-А",rZakh)],
                    "ПТ": []
                },
                week2: {
                    "ПН": [],
                    "ВТ": [L("",t5_5,Zakh,"11-А",rOnl)],
                    "СР": [],
                    "ЧТ": [L("",t5_5,Zakh,"11-А",rOnl)],
                    "ПТ": []
                }
            },
            "Марченко Світлана Володимирівна": dupW({
                "ПН": [L("",t2_3,M,"4-Б",r5), L("",t3_3,L_subj,"4-Б",r5), L("",t4_3,Y,"4-Б",r5), L("",t5_3,D,"4-Б",r5)],
                "ВТ": [L("",t2_3,M,"4-Б",r5), L("",t3_3,U,"4-Б",r5), L("",t4_3,PE,"4-Б",rGym)],
                "СР": [L("",t1_3,U,"4-Б",r5), L("",t2_3,M,"4-Б",r5), L("",t3_3,PE,"4-Б",rGym), L("",t4_3,Y,"4-Б",r5), L("",t5_3,A,"4-Б",r5), L("",t6_3,I,"4-Б",r20_26)],
                "ЧТ": [L("",t2_3,M,"4-Б",r5), L("",t3_3,U,"4-Б",r5), L("",t4_3,L_subj,"4-Б",r5), L("",t5_3,PE,"4-Б",rGym)],
                "ПТ": [L("",t1_3,U,"4-Б",r5), L("",t2_3,M,"4-Б",r5), L("",t3_3,L_subj,"4-Б",r5), L("",t4_3,Y,"4-Б",r5)]
            }),
            "Михайлицька Ольга Сергіївна": {
                week1: {
                    "ПН": [L("",t5_5,A,"9-А",rAct), L("",t6_5,A,"9-Б",rAct), L("",t7_5,A,"9-В",rAct), L("",t4_4,Dram,"5-А",rAct), L("",t5_4,Dram,"5-Б",rAct), L("",t6_4,Dram,"5-В",rAct)],
                    "ВТ": [],
                    "СР": [L("",t1_5,Dram,"7-Б",rOnl), L("",t2_5,Dram,"7-А",rOnl), L("",t7_5,Dram,"8-Б",rOnl), L("",t6_4,A,"6-В",rOnl)],
                    "ЧТ": [L("",t1_5,A,"11-А",rAct), L("",t2_5,A,"10-А",rAct), L("",t2_4,Dram,"6-В",rOnl)],
                    "ПТ": [L("",t2_5,A,"7-В",rOnl), L("",t4_5,A,"7-Б",rOnl), L("",t5_5,A,"8-В",rOnl), L("",t6_5,A,"8-А",rOnl), L("",t2_4,Dram,"6-А",rOnl), L("",t3_4,Dram,"6-Б",rOnl)]
                },
                week2: {
                    "ПН": [L("",t5_5,A,"9-А",rAct), L("",t6_5,A,"9-Б",rAct), L("",t7_5,A,"9-В",rAct), L("",t4_4,Dram,"5-А",rAct), L("",t5_4,Dram,"5-Б",rAct), L("",t6_4,Dram,"5-В",rAct)],
                    "ВТ": [],
                    "СР": [L("",t1_5,Dram,"7-Б",rAct), L("",t2_5,Dram,"7-А",rAct), L("",t7_5,Dram,"8-Б",rAct), L("",t6_4,A,"6-В",r34)],
                    "ЧТ": [L("",t1_5,A,"11-А",rAct), L("",t2_5,A,"10-А",rAct), L("",t2_4,Dram,"6-В",rAct)],
                    "ПТ": [L("",t2_5,A,"7-В",r36), L("",t4_5,A,"7-Б",r37), L("",t5_5,A,"8-В",rAct), L("",t6_5,A,"8-А",rAct), L("",t2_4,Dram,"6-А",rAct), L("",t3_4,Dram,"6-Б",rAct)]
                }
            },
            "Назарчук Ірина Анатоліївна": dupW({
                "ПН": [L("",t1_3,U,"3-А",r2), L("",t2_3,M,"3-А",r2), L("",t4_3,L_subj,"3-А",r2), L("",t5_3,PE,"3-А",rGym)],
                "ВТ": [L("",t1_3,U,"3-А",r2), L("",t2_3,M,"3-А",r2), L("",t3_3,L_subj,"3-А",r2), L("",t4_3,Y,"3-А",r2), L("",t5_3,Y,"3-А",r2)],
                "СР": [L("",t2_3,U,"3-А",r2), L("",t3_3,M,"3-А",r2), L("",t4_3,L_subj,"3-А",r2), L("",t5_3,PE,"3-А",rGym)],
                "ЧТ": [L("",t1_3,U,"3-А",r2), L("",t2_3,M,"3-А",r2), L("",t3_3,Y,"3-А",r2), L("",t4_3,I,"3-А",r26_20), L("",t5_3,PE,"3-А",rGym)],
                "ПТ": [L("",t2_3,M,"3-А",r2), L("",t3_3,D,"3-А",r2), L("",t4_3,A,"3-А",r2)]
            }),
            "Назарчук Лілія Юріївна": dupW({
                "ПН": [L("",t1_1,U,"1-Б",r2), L("",t2_1,U,"1-Б",r2), L("",t3_1,M,"1-Б",r2), L("",t4_1,PE,"1-Б",rGym)],
                "ВТ": [L("",t1_1,U,"1-Б",r2), L("",t3_1,M,"1-Б",r2), L("",t4_1,Y,"1-Б",r2), L("",t5_1,Y,"1-Б",r2)],
                "СР": [L("",t1_1,U,"1-Б",r2), L("",t2_1,U,"1-Б",r2), L("",t3_1,M,"1-Б",r2), L("",t4_1,PE,"1-Б",rGym)],
                "ЧТ": [L("",t1_1,U,"1-Б",r2), L("",t2_1,M,"1-Б",r2), L("",t3_1,Y,"1-Б",r2), L("",t4_1,PE,"1-Б",rGym)],
                "ПТ": [L("",t2_1,U,"1-Б",r2), L("",t3_1,D,"1-Б",r2), L("",t4_1,A,"1-Б",r2)]
            }),
            "Опанчук Марина Ігорівна": {
                week1: {
                    "ПН": [L("",t7_5,PE,"8-В",rOnl), L("",t3_4,PE,"5-А",rGym), L("",t4_4,PE,"5-Б",rGym), L("",t4_4,PE,"5-В",rGym), L("",t6_4,PE,"6-А",rOnl)],
                    "ВТ": [L("",t7_5,PE,"8-В",rOnl), L("",t4_4,PE,"6-А",rOnl), L("",t5_4,PE,"6-Б",rOnl), L("",t5_4,PE,"6-В",rOnl)],
                    "СР": [L("",t3_4,PE,"5-А",rGym), L("",t3_4,PE,"5-Б",rGym), L("",t4_4,PE,"5-В",rGym), L("",t6_4,PE,"6-Б",rOnl)],
                    "ЧТ": [L("",t7_5,PE,"8-В",rOnl), L("",t4_4,PE,"6-А",rOnl), L("",t5_4,PE,"6-Б",rOnl), L("",t5_4,PE,"6-В",rOnl)],
                    "ПТ": [L("",t2_4,PE,"5-А",rGym), L("",t6_4,PE,"5-Б",rGym), L("",t4_4,PE,"5-В",rGym), L("",t5_4,PE,"6-В",rOnl)]
                },
                week2: {
                    "ПН": [L("",t7_5,PE,"8-В",rGym), L("",t3_4,PE,"5-А",rGym), L("",t4_4,PE,"5-Б",rGym), L("",t4_4,PE,"5-В",rGym), L("",t6_4,PE,"6-А",rGym)],
                    "ВТ": [L("",t7_5,PE,"8-В",rGym), L("",t4_4,PE,"6-А",rGym), L("",t5_4,PE,"6-Б",rGym), L("",t5_4,PE,"6-В",rGym)],
                    "СР": [L("",t3_4,PE,"5-А",rGym), L("",t3_4,PE,"5-Б",rGym), L("",t4_4,PE,"5-В",rGym), L("",t6_4,PE,"6-Б",rGym)],
                    "ЧТ": [L("",t7_5,PE,"8-В",rGym), L("",t4_4,PE,"6-А",rGym), L("",t5_4,PE,"6-Б",rGym), L("",t5_4,PE,"6-В",rGym)],
                    "ПТ": [L("",t2_4,PE,"5-А",rGym), L("",t6_4,PE,"5-Б",rGym), L("",t4_4,PE,"5-В",rGym), L("",t5_4,PE,"6-В",rGym)]
                }
            },
            "Осипенко Сергій Станіславович": {
                week1: {
                    "ПН": [],
                    "ВТ": [],
                    "СР": [L("",t3_5,Tech,"8-Б",rOnl), L("",t5_5,Tech,"8-А",rOnl)],
                    "ЧТ": [L("",t6_5,Tech,"9-А",r25_Myst), L("",t7_5,Tech,"9-Б",rMyst), L("",t7_5,Tech,"9-В",rMyst), L("",t5_4,Tech,"5-Б",rMyst), L("",t6_4,Tech,"5-А",rMyst)],
                    "ПТ": [L("",t7_5,Tech,"8-В",rOnl), L("",t4_4,Tech,"6-В",rOnl), L("",t5_4,Tech,"6-А",rOnl), L("",t6_4,Tech,"6-Б",rOnl)]
                },
                week2: {
                    "ПН": [],
                    "ВТ": [],
                    "СР": [L("",t3_5,Tech,"8-Б",rMyst), L("",t5_5,Tech,"8-А",rMyst)],
                    "ЧТ": [L("",t6_5,Tech,"9-А",rOnl), L("",t7_5,Tech,"9-Б",rOnl), L("",t7_5,Tech,"9-В",rOnl), L("",t5_4,Tech,"5-Б",rMyst), L("",t6_4,Tech,"5-А",rMyst)],
                    "ПТ": [L("",t7_5,Tech,"8-В",rMyst), L("",t4_4,Tech,"6-В",rMyst), L("",t5_4,Tech,"6-А",rMyst), L("",t6_4,Tech,"6-Б",rMyst)]
                }
            },
            "Пазич Ірина Сергіївна": {
                week1: {
                    "ПН": [L("",t2_5,Biol,"7-Б",rOnl), L("",t3_5,Biol,"7-В",rOnl), L("",t4_5,Biol,"7-А",rOnl), L("",t0_4,Nat,"6-В",rOnl)],
                    "ВТ": [L("",t1_5,Biol,"11-А",r34), L("",t2_5,Biol,"7-А",rOnl), L("",t4_5,Biol,"7-Б",rOnl), L("",t5_5,Biol,"7-В",rOnl)],
                    "СР": [L("",t1_5,Biol,"8-В",rOnl), L("",t3_5,Biol,"9-В",r40), L("",t4_5,Biol,"9-Б",r41), L("",t5_5,Biol,"8-Б",rOnl), L("",t7_5,Biol,"8-А",rOnl)],
                    "ЧТ": [L("",t2_5,Biol,"8-В",rOnl), L("",t2_5,Biol,"8-Б",rOnl), L("",t5_5,Biol,"8-А",rOnl), L("",t0_4,Nat,"6-А",rOnl), L("",t6_4,Nat,"6-Б",rOnl)],
                    "ПТ": [L("",t1_5,Biol,"9-А",r41), L("",t2_5,Biol,"11-А",r34), L("",t3_5,Biol,"10-А",r26), L("",t4_5,Biol,"9-В",r40), L("",t5_5,Biol,"9-Б",r41)]
                },
                week2: {
                    "ПН": [L("",t2_5,Biol,"7-Б",r37), L("",t3_5,Biol,"7-В",r36), L("",t4_5,Biol,"7-А",r39), L("",t0_4,Nat,"6-В",r34)],
                    "ВТ": [L("",t1_5,Biol,"11-А",rOnl), L("",t2_5,Biol,"7-А",r39), L("",t4_5,Biol,"7-Б",r37), L("",t5_5,Biol,"7-В",r36)],
                    "СР": [L("",t1_5,Biol,"8-В",r30), L("",t3_5,Biol,"9-В",rOnl), L("",t4_5,Biol,"9-Б",rOnl), L("",t5_5,Biol,"8-Б",r33), L("",t7_5,Biol,"8-А",r35)],
                    "ЧТ": [L("",t2_5,Biol,"8-В",r30), L("",t2_5,Biol,"8-Б",r33), L("",t5_5,Biol,"8-А",r35), L("",t0_4,Nat,"6-А",r33), L("",t6_4,Nat,"6-Б",r30)],
                    "ПТ": [L("",t1_5,Biol,"9-А",rOnl), L("",t2_5,Biol,"11-А",rOnl), L("",t3_5,Biol,"10-А",rOnl), L("",t4_5,Biol,"9-В",rOnl), L("",t5_5,Biol,"9-Б",rOnl)]
                }
            },
            "Проботюк Анатолій Олександрович": {
                week1: {
                    "ПН": [L("",t1_5,I,"9-В",r26_20), L("",t3_5,I,"9-Б",r26_20), L("",t5_5,I,"11-А",r26_20), L("",t6_5,I,"10-А",r26_20), L("",t7_5,I,"9-А",r26_20)],
                    "ВТ": [],
                    "СР": [],
                    "ЧТ": [L("",t1_5,I,"9-В",r26_20), L("",t2_5,I,"9-Б",r20_26), L("",t3_5,I,"8-Б",rOnl), L("",t4_5,I,"8-А",rOnl)],
                    "ПТ": [L("",t1_5,Pidpr,"8-А",rOnl), L("",t3_5,I,"9-А",r26_20), L("",t6_5,I,"8-Б",rOnl), L("",t6_5,Pidpr,"8-В",rOnl)]
                },
                week2: {
                    "ПН": [L("",t1_5,I,"9-В",rOnl), L("",t3_5,I,"9-Б",rOnl), L("",t5_5,I,"11-А",rOnl), L("",t6_5,I,"10-А",rOnl), L("",t7_5,I,"9-А",rOnl)],
                    "ВТ": [],
                    "СР": [],
                    "ЧТ": [L("",t1_5,I,"9-В",rOnl), L("",t2_5,I,"9-Б",rOnl), L("",t3_5,I,"8-Б",r20_26), L("",t4_5,I,"8-А",r26_20)],
                    "ПТ": [L("",t1_5,Pidpr,"8-А",rOnl), L("",t3_5,I,"9-А",rOnl), L("",t6_5,I,"8-Б",r26_20), L("",t6_5,Pidpr,"8-В",rOnl)]
                }
            },
            "Проботюк Ольга Домініківна": {
                week1: {
                    "ПН": [L("",t4_5,U,"10-А",r26)],
                    "ВТ": [L("",t1_5,ULit,"10-А",r26), L("",t2_5,ULit,"10-А",r26)],
                    "СР": [L("",t3_5,ULit,"10-А",r26)],
                    "ЧТ": [L("",t1_5,U,"10-А",r26), L("",t6_5,U,"10-А",r26)],
                    "ПТ": [L("",t1_5,U,"10-А",r26), L("",t7_5,U,"10-А",r26)]
                },
                week2: {
                    "ПН": [L("",t4_5,U,"10-А",rOnl)],
                    "ВТ": [L("",t1_5,ULit,"10-А",rOnl), L("",t2_5,ULit,"10-А",rOnl)],
                    "СР": [L("",t3_5,ULit,"10-А",rOnl)],
                    "ЧТ": [L("",t1_5,U,"10-А",rOnl), L("",t6_5,U,"10-А",rOnl)],
                    "ПТ": [L("",t1_5,U,"10-А",rOnl), L("",t7_5,U,"10-А",rOnl)]
                }
            },
            "Пустохіна Вікторія Ігорівна": {
                week1: {
                    "ПН": [L("",t1_5,ULit,"11-А",r34), L("",t2_5,U,"11-А",r34)],
                    "ВТ": [],
                    "СР": [L("",t1_5,ULit,"11-А",r34), L("",t2_5,ULit,"11-А",r34), L("",t5_5,U,"11-А",r34), L("",t7_5,Zar,"11-А",r34)],
                    "ЧТ": [L("",t7_5,U,"11-А",r34)],
                    "ПТ": [L("",t5_5,Zar,"11-А",r34), L("",t6_5,ULit,"11-А",r34), L("",t7_5,U,"11-А",r34)]
                },
                week2: {
                    "ПН": [L("",t1_5,ULit,"11-А",rOnl), L("",t2_5,U,"11-А",rOnl)],
                    "ВТ": [],
                    "СР": [L("",t1_5,ULit,"11-А",rOnl), L("",t2_5,ULit,"11-А",rOnl), L("",t5_5,U,"11-А",rOnl), L("",t7_5,Zar,"11-А",rOnl)],
                    "ЧТ": [L("",t7_5,U,"11-А",rOnl)],
                    "ПТ": [L("",t5_5,Zar,"11-А",rOnl), L("",t6_5,ULit,"11-А",rOnl), L("",t7_5,U,"11-А",rOnl)]
                }
            },
            "Пустохіна Єванжеліна Федорівна": {
                week1: {
                    "ПН": [L("",t5_5,ULit,"7-В",rOnl), L("",t6_5,ULit,"7-А",rOnl), L("",t1_4,U,"6-В",rOnl), L("",t2_4,Zar,"6-В",rOnl)],
                    "ВТ": [L("",t5_5,U,"7-А",rOnl), L("",t6_5,U,"7-В",rOnl), L("",t1_4,U,"6-В",rOnl), L("",t3_4,ULit,"6-В",rOnl)],
                    "СР": [L("",t5_5,U,"11-А",r34), L("",t6_5,U,"7-А",rOnl), L("",t7_5,U,"7-В",rOnl), L("",t2_4,U,"6-В",rOnl), L("",t3_4,ULit,"6-В",rOnl)],
                    "ЧТ": [L("",t6_5,ULit,"7-А",rOnl), L("",t7_5,ULit,"7-В",rOnl), L("",t3_4,Zar,"6-В",rOnl), L("",t4_4,U,"6-В",rOnl)],
                    "ПТ": [L("",t5_5,U,"7-А",rOnl), L("",t6_5,U,"7-В",rOnl), L("",t7_5,U,"11-А",r34)]
                },
                week2: {
                    "ПН": [L("",t5_5,ULit,"7-В",r36), L("",t6_5,ULit,"7-А",r41), L("",t1_4,U,"6-В",r34), L("",t2_4,Zar,"6-В",r34)],
                    "ВТ": [L("",t5_5,U,"7-А",r39), L("",t6_5,U,"7-В",r36), L("",t1_4,U,"6-В",r34), L("",t3_4,ULit,"6-В",r34)],
                    "СР": [L("",t5_5,U,"11-А",rOnl), L("",t6_5,U,"7-А",r39), L("",t7_5,U,"7-В",r36), L("",t2_4,U,"6-В",r34), L("",t3_4,ULit,"6-В",r34)],
                    "ЧТ": [L("",t6_5,ULit,"7-А",r39), L("",t7_5,ULit,"7-В",r36), L("",t3_4,Zar,"6-В",r34), L("",t4_4,U,"6-В",r34)],
                    "ПТ": [L("",t5_5,U,"7-А",r39), L("",t6_5,U,"7-В",r36), L("",t7_5,U,"11-А",rOnl)]
                }
            },
            "Рисіч Тетяна Ігорівна": {
                week1: {
                    "ПН": [L("",t5_5,Zar,"9-А",r25), L("",t6_5,Zar,"9-Б",r41)],
                    "ВТ": [L("",t4_5,Zar,"8-А",rOnl), L("",t5_5,Zar,"8-В",rOnl)],
                    "СР": [L("",t5_5,Zar,"8-В",rOnl)],
                    "ЧТ": [L("",t5_5,Zar,"9-А",r25), L("",t6_5,Zar,"9-Б",r41)],
                    "ПТ": [L("",t5_5,A,"8-Б",rOnl)]
                },
                week2: {
                    "ПН": [L("",t5_5,Zar,"9-А",rOnl), L("",t6_5,Zar,"9-Б",rOnl)],
                    "ВТ": [L("",t4_5,Zar,"8-А",r35), L("",t5_5,Zar,"8-В",r30)],
                    "СР": [L("",t5_5,Zar,"8-В",r30)],
                    "ЧТ": [L("",t5_5,Zar,"9-А",rOnl), L("",t6_5,Zar,"9-Б",rOnl)],
                    "ПТ": [L("",t5_5,A,"8-Б",rAct)]
                }
            },
            "Савчук Ірина Вікторівна": {
                week1: {
                    "ПН": [L("",t1_5,Alg,"7-А",rOnl), L("",t4_5,Alg,"7-В",rOnl), L("",t1_4,M,"5-Б",r37), L("",t3_4,M,"6-В",rOnl)],
                    "ВТ": [L("",t3_5,Geom,"7-А",rOnl), L("",t1_5,Geom,"7-В",rOnl), L("",t1_4,M,"5-Б",r37), L("",t0_4,M,"6-В",rOnl)],
                    "СР": [L("",t1_5,Alg,"7-А",rOnl), L("",t4_5,Alg,"7-В",rOnl), L("",t1_4,M,"5-Б",r37), L("",t0_4,M,"6-В",rOnl)],
                    "ЧТ": [L("",t3_5,Geom,"7-А",rOnl), L("",t1_5,Geom,"7-В",rOnl), L("",t2_4,M,"5-Б",r37), L("",t1_4,M,"6-В",rOnl)],
                    "ПТ": [L("",t3_5,Alg,"7-А",rOnl), L("",t1_5,Alg,"7-В",rOnl), L("",t1_4,M,"5-Б",r37), L("",t2_4,M,"6-В",rOnl)]
                },
                week2: {
                    "ПН": [L("",t1_5,Alg,"7-А",r39), L("",t4_5,Alg,"7-В",r36), L("",t1_4,M,"5-Б",r37), L("",t3_4,M,"6-В",r34)],
                    "ВТ": [L("",t3_5,Geom,"7-А",r39), L("",t1_5,Geom,"7-В",r36), L("",t1_4,M,"5-Б",r37), L("",t0_4,M,"6-В",r34)],
                    "СР": [L("",t1_5,Alg,"7-А",r39), L("",t4_5,Alg,"7-В",r36), L("",t1_4,M,"5-Б",r37), L("",t0_4,M,"6-В",r34)],
                    "ЧТ": [L("",t3_5,Geom,"7-А",r39), L("",t1_5,Geom,"7-В",r36), L("",t2_4,M,"5-Б",r37), L("",t1_4,M,"6-В",r34)],
                    "ПТ": [L("",t3_5,Alg,"7-А",r39), L("",t1_5,Alg,"7-В",r36), L("",t1_4,M,"5-Б",r37), L("",t2_4,M,"6-В",r34)]
                }
            },
            "Саранча Микола Петрович": {
                week1: {
                    "ПН": [L("",t1_5,PE,"9-А",rGym), L("",t2_5,PE,"10-А",rGym), L("",t3_5,PE,"11-А",rGym)],
                    "ВТ": [],
                    "СР": [L("",t1_5,PE,"9-А",rGym), L("",t2_5,PE,"10-А",rGym), L("",t3_5,PE,"11-А",rGym)],
                    "ЧТ": [L("",t1_5,PE,"9-А",rGym), L("",t3_5,PE,"10-А",rGym), L("",t2_5,PE,"11-А",rGym)],
                    "ПТ": []
                },
                week2: {
                    "ПН": [L("",t1_5,PE,"9-А",rOnl), L("",t2_5,PE,"10-А",rOnl), L("",t3_5,PE,"11-А",rOnl)],
                    "ВТ": [],
                    "СР": [L("",t1_5,PE,"9-А",rOnl), L("",t2_5,PE,"10-А",rOnl), L("",t3_5,PE,"11-А",rOnl)],
                    "ЧТ": [L("",t1_5,PE,"9-А",rOnl), L("",t3_5,PE,"10-А",rOnl), L("",t2_5,PE,"11-А",rOnl)],
                    "ПТ": []
                }
            },
            "Сергєєва Ірина Михайлівна": {
                week1: {
                    "ПН": [L("",t1_4,Eth,"6-А",rOnl), L("",t4_4,Eth,"6-Б",rOnl), L("",t5_4,A,"6-Б",rOnl), L("",t6_5,Zar,"9-В",r40)],
                    "ВТ": [L("",t2_4,A,"5-А",r39), L("",t3_4,A,"5-Б",r37), L("",t1_4,A,"5-В",r36), L("",t6_5,Zar,"8-Б",rOnl)],
                    "СР": [L("",t3_4,Zar,"5-А",r39), L("",t2_4,Eth,"5-Б",r37), L("",t4_5,Zar,"7-А",rOnl), L("",t5_5,Zar,"7-В",rOnl), L("",t5_5,Zar,"8-Б",rOnl)],
                    "ЧТ": [L("",t1_4,Zar,"5-А",r39), L("",t4_4,Zar,"5-Б",r37), L("",t2_4,Zar,"6-А",rOnl), L("",t3_4,Zar,"6-Б",rOnl), L("",t6_5,Zar,"9-В",r40)],
                    "ПТ": [L("",t1_5,Zar,"7-А",rOnl), L("",t2_5,Zar,"7-Б",rOnl), L("",t4_5,Zar,"7-В",rOnl), L("",t5_5,Zar,"10-А",r26)]
                },
                week2: {
                    "ПН": [L("",t1_4,Zar,"6-А",r33), L("",t4_4,Zar,"6-Б",r30), L("",t5_4,A,"6-Б",r30), L("",t6_5,Zar,"9-В",rOnl)],
                    "ВТ": [L("",t2_4,A,"5-А",r39), L("",t3_4,A,"5-Б",r37), L("",t1_4,A,"5-В",r36), L("",t6_5,Zar,"8-Б",r33)],
                    "СР": [L("",t3_4,Zar,"5-А",r39), L("",t2_4,Eth,"5-Б",r37), L("",t4_5,Zar,"7-А",r39), L("",t5_5,Zar,"7-В",r36), L("",t5_5,Zar,"8-Б",r33)],
                    "ЧТ": [L("",t1_4,Zar,"5-А",r39), L("",t4_4,Zar,"5-Б",r37), L("",t2_4,Zar,"6-А",r33), L("",t3_4,Zar,"6-Б",r30), L("",t6_5,Zar,"9-В",rOnl)],
                    "ПТ": [L("",t1_5,Zar,"7-А",r39), L("",t2_5,Zar,"7-Б",r37), L("",t4_5,Zar,"7-В",r36), L("",t5_5,Zar,"10-А",rOnl)]
                }
            },
            "Столяр Ірина Сергіївна": dupW({
                "ПН": [L("",t1_3,U,"3-В",r24), L("",t3_3,M,"3-В",r24), L("",t4_3,PE,"3-В",rGym), L("",t5_3,Y,"3-В",r24)],
                "ВТ": [L("",t1_3,L_subj,"3-В",r24), L("",t2_3,U,"3-В",r24), L("",t3_3,M,"3-В",r24), L("",t4_3,Y,"3-В",r24), L("",t5_3,D,"3-В",r24)],
                "СР": [L("",t1_3,L_subj,"3-В",r24), L("",t3_3,U,"3-В",r24), L("",t4_3,M,"3-В",r24), L("",t5_3,A,"3-В",r24)],
                "ЧТ": [L("",t1_3,M,"3-В",r24), L("",t2_3,U,"3-В",r24), L("",t3_3,PE,"3-В",rGym)],
                "ПТ": [L("",t1_3,Y,"3-В",r24), L("",t2_3,L_subj,"3-В",r24), L("",t3_3,M,"3-В",r24), L("",t4_3,PE,"3-В",rGym)]
            }),
            "Стременко Катерина Андріївна": dupW({
                "ПН": [L("",t1_3,U,"3-Б",r4), L("",t2_3,M,"3-Б",r4), L("",t3_3,L_subj,"3-Б",r4), L("",t5_3,PE,"3-Б",rGym)],
                "ВТ": [L("",t1_3,U,"3-Б",r4), L("",t2_3,M,"3-Б",r4), L("",t3_3,Y,"3-Б",r4), L("",t4_3,L_subj,"3-Б",r4), L("",t5_3,PE,"3-Б",rGym)],
                "СР": [L("",t1_3,M,"3-Б",r4), L("",t2_3,Y,"3-Б",r4), L("",t4_3,U,"3-Б",r4), L("",t5_3,A,"3-Б",r4)],
                "ЧТ": [L("",t1_3,U,"3-Б",r4), L("",t2_3,M,"3-Б",r4), L("",t3_3,Y,"3-Б",r4), L("",t4_3,L_subj,"3-Б",r4)],
                "ПТ": [L("",t2_3,M,"3-Б",r4), L("",t3_3,PE,"3-Б",rGym), L("",t4_3,D,"3-Б",r4)]
            }),
            "Тарасенко Аліна Сергіївна": dupW({
                "ПН": [L("",t1_2,M,"2-А",r23), L("",t3_2,PE,"2-А",rGym), L("",t4_2,U,"2-А",r23), L("",t5_2,L_subj,"2-А",r23)],
                "ВТ": [L("",t1_2,U,"2-А",r23), L("",t2_2,M,"2-А",r23), L("",t3_2,Y,"2-А",r23), L("",t4_2,I,"2-А",r20), L("",t5_2,L_subj,"2-А",r23)],
                "СР": [L("",t1_2,U,"2-А",r23), L("",t2_2,M,"2-А",r23), L("",t3_2,PE,"2-А",rGym), L("",t4_2,L_subj,"2-А",r23), L("",t5_2,Y,"2-А",r23)],
                "ЧТ": [L("",t1_2,U,"2-А",r23), L("",t2_2,M,"2-А",r23), L("",t4_2,D,"2-А",r23)],
                "ПТ": [L("",t1_2,Y,"2-А",r23), L("",t2_2,A,"2-А",r23), L("",t4_2,PE,"2-А",rGym)]
            }),
            "Українець Лариса Олександрівна": {
                week1: {
                    "ПН": [L("",t3_5,Alg,"9-А",r25), L("",t4_5,Alg,"9-Б",r41), L("",t2_5,Alg,"9-В",r40), L("",t1_5,Alg,"10-А",r26), L("",t1_4,M,"6-Б",rOnl)],
                    "ВТ": [L("",t1_5,Geom,"9-А",r25), L("",t3_5,Geom,"9-Б",r41), L("",t2_5,Geom,"9-В",r40), L("",t5_5,Geom,"10-А",r26), L("",t4_5,Geom,"11-А",r34), L("",t1_4,M,"6-Б",rOnl)],
                    "СР": [L("",t2_5,Alg,"9-А",r25), L("",t3_5,Alg,"9-Б",r41), L("",t4_5,Alg,"9-В",r40), L("",t1_5,Alg,"10-А",r26), L("",t4_5,Alg,"11-А",r34), L("",t1_4,M,"6-Б",rOnl)],
                    "ЧТ": [L("",t2_5,Geom,"9-А",r25), L("",t1_5,Geom,"9-Б",r41), L("",t3_5,Geom,"9-В",r40), L("",t4_5,Geom,"11-А",r34), L("",t2_4,M,"6-Б",rOnl)],
                    "ПТ": [L("",t5_5,Alg,"9-А",r25), L("",t4_5,Alg,"9-Б",r41), L("",t3_5,Alg,"9-В",r40), L("",t2_5,Geom,"10-А",r26), L("",t1_5,Alg,"11-А",r34), L("",t1_4,M,"6-Б",rOnl)]
                },
                week2: {
                    "ПН": [L("",t3_5,Alg,"9-А",rOnl), L("",t4_5,Alg,"9-Б",rOnl), L("",t2_5,Alg,"9-В",rOnl), L("",t1_5,Alg,"10-А",rOnl), L("",t1_4,M,"6-Б",r30)],
                    "ВТ": [L("",t1_5,Geom,"9-А",rOnl), L("",t3_5,Geom,"9-Б",rOnl), L("",t2_5,Geom,"9-В",rOnl), L("",t5_5,Geom,"10-А",rOnl), L("",t4_5,Geom,"11-А",rOnl), L("",t1_4,M,"6-Б",r30)],
                    "СР": [L("",t2_5,Alg,"9-А",rOnl), L("",t3_5,Alg,"9-Б",rOnl), L("",t4_5,Alg,"9-В",rOnl), L("",t1_5,Alg,"10-А",rOnl), L("",t4_5,Alg,"11-А",rOnl), L("",t1_4,M,"6-Б",r30)],
                    "ЧТ": [L("",t2_5,Geom,"9-А",rOnl), L("",t1_5,Geom,"9-Б",rOnl), L("",t3_5,Geom,"9-В",rOnl), L("",t4_5,Geom,"11-А",rOnl), L("",t2_4,M,"6-Б",r30)],
                    "ПТ": [L("",t5_5,Alg,"9-А",rOnl), L("",t4_5,Alg,"9-Б",rOnl), L("",t3_5,Alg,"9-В",rOnl), L("",t2_5,Geom,"10-А",rOnl), L("",t1_5,Alg,"11-А",rOnl), L("",t1_4,M,"6-Б",r30)]
                }
            },
            "Флячинська Ольга Миколаївна": dupW({
                "ПН": [L("",t1_1,U,"1-А",r4), L("",t2_1,M,"1-А",r4), L("",t3_1,U,"1-А",r4), L("",t4_1,Y,"1-А",r4)],
                "ВТ": [L("",t2_1,M,"1-А",r4), L("",t3_1,Y,"1-А",r4), L("",t4_1,PE,"1-А",rGym), L("",t5_1,D,"1-А",r4)],
                "СР": [L("",t1_1,U,"1-А",r4), L("",t2_1,M,"1-А",r4), L("",t3_1,U,"1-А",r4), L("",t4_1,Y,"1-А",r4)],
                "ЧТ": [L("",t1_1,U,"1-А",r4), L("",t2_1,M,"1-А",r4), L("",t3_1,U,"1-А",r4), L("",t4_1,PE,"1-А",rGym)],
                "ПТ": [L("",t1_1,U,"1-А",r4), L("",t3_1,A,"1-А",r4), L("",t4_1,PE,"1-А",rGym)]
            }),
            "Шатківська Олена Борисівна": dupW({
                "ПН": [L("",t1_1,Y,"1-В",r24), L("",t2_1,U,"1-В",r24), L("",t4_1,PE,"1-В",rGym)],
                "ВТ": [L("",t1_1,Y,"1-В",r24), L("",t2_1,U,"1-В",r24), L("",t3_1,M,"1-В",r24), L("",t4_1,U,"1-В",r24), L("",t5_1,PE,"1-В",rGym)],
                "СР": [L("",t1_1,U,"1-В",r24), L("",t2_1,M,"1-В",r24), L("",t3_1,U,"1-В",r24), L("",t4_1,Y,"1-В",r24)],
                "ЧТ": [L("",t1_1,U,"1-В",r24), L("",t2_1,M,"1-В",r24), L("",t3_1,PE,"1-В",rGym), L("",t4_1,D,"1-В",r24)],
                "ПТ": [L("",t1_1,M,"1-В",r24), L("",t3_1,U,"1-В",r24), L("",t4_1,A,"1-В",r24)]
            }),
            "Якусевич Наталя Володимирівна": dupW({
                "ПН": [L("",t4_5,Phys,"8-В",rOnl), L("",t2_5,Phys,"8-Б",rOnl), L("",t5_5,Phys,"8-А",rOnl), L("",t3_5,Phys,"10-А",r26), L("",t6_5,Phys,"11-А",r34), L("",t2_4,M,"5-А",r39)],
                "ВТ": [L("",t4_5,Phys,"8-В",rOnl), L("",t2_5,Phys,"8-Б",rOnl), L("",t7_5,Phys,"8-А",rOnl), L("",t6_5,Phys,"10-А",r26), L("",t3_5,Phys,"11-А",r34), L("",t3_4,M,"5-А",r39)],
                "СР": [L("",t2_5,Phys,"7-Б",rOnl), L("",t1_5,Phys,"7-В",rOnl), L("",t1_4,M,"5-А",r39)],
                "ЧТ": [L("",t4_5,Phys,"7-А",rOnl), L("",t6_5,Phys,"7-Б",rOnl), L("",t2_5,Phys,"7-В",rOnl), L("",t7_5,Phys,"10-А",r26), L("",t3_5,Phys,"11-А",r34), L("",t4_4,M,"5-А",r39)],
                "ПТ": [L("",t6_5,Geo,"10-А",r26), L("",t4_5,Astr,"11-А",r34), L("",t3_4,M,"5-А",r39)]
            }),
            "Ярмоліцька Наталія Юріївна": dupW({
                "ПН": [L("",t1_5,Alg,"8-В",rOnl), L("",t2_5,Alg,"8-А",rOnl)],
                "ВТ": [L("",t2_5,Geom,"8-А",rOnl), L("",t3_5,Geom,"8-В",rOnl), L("",t7_5,Zdor,"7-В",rOnl)],
                "СР": [L("",t1_5,Alg,"8-А",rOnl), L("",t2_5,Alg,"8-В",rOnl)],
                "ЧТ": [L("",t1_5,Geom,"8-А",rOnl), L("",t2_5,Geom,"8-В",rOnl)],
                "ПТ": [L("",t2_5,Ozn,"8-Б",rOnl), L("",t3_5,Alg,"8-В",rOnl), L("",t4_5,Alg,"8-А",rOnl)]
            }),
            "Ярошенко Наталія Миколаївна": dupW({
                "ПН": [L("",t1_5,Tech,"7-Б",rOnl), L("",t2_5,Tech,"7-В",rOnl), L("",t3_5,Tech,"7-А",rOnl)],
                "ВТ": [],
                "СР": [L("",t6_4,Tech,"5-В",r36)],
                "ЧТ": [L("",t6_5,Tech,"9-А",r25_Myst), L("",t3_4,Zar,"5-В",r36), L("",t6_4,Zar,"5-В",r36)],
                "ПТ": []
            })
        }
    };

    window.setSchType = function(type) {
        stateSchType = type;
        document.querySelectorAll('.sch-toggle-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById(`btn-type-${type}`);
        if (activeBtn) activeBtn.classList.add('active');
        
        const sel = document.getElementById('sch-selector');
        if (sel && window.MY_REAL_SCHEDULE && window.MY_REAL_SCHEDULE[type]) {
            sel.innerHTML = `<option value="">Оберіть...</option>` + Object.keys(window.MY_REAL_SCHEDULE[type]).map(k => `<option value="${k}">${k}</option>`).join('');
        }
        if (typeof window.renderSchedule === 'function') window.renderSchedule();
    };

    window.setSchWeek = function(w) {
        stateSchWeek = w;
        const btnW1 = document.getElementById('btn-week-1');
        const btnW2 = document.getElementById('btn-week-2');
        if (btnW1) btnW1.classList.toggle('active', w==='week1');
        if (btnW2) btnW2.classList.toggle('active', w==='week2');
        if (typeof window.renderSchedule === 'function') window.renderSchedule();
    };

    window.setSchDay = function(d) {
        stateSchDay = d;
        document.querySelectorAll('.sch-day').forEach(b => b.classList.toggle('active', b.id === `day-${d}`));
        if (typeof window.renderSchedule === 'function') window.renderSchedule();
    };

    window.renderSchedule = function() {
        const container = document.getElementById('sch-lessons-container');
        const sel = document.getElementById('sch-selector');
        const val = sel ? sel.value : null;
        
        if (!container) return;
        if (!window.MY_REAL_SCHEDULE || !val || !window.MY_REAL_SCHEDULE[stateSchType] || !window.MY_REAL_SCHEDULE[stateSchType][val]) {
            container.innerHTML = '<div class="sch-empty">Оберіть клас або вчителя</div>';
            return;
        }
        
        const scheduleTypeData = window.MY_REAL_SCHEDULE[stateSchType];
        const valData = scheduleTypeData ? scheduleTypeData[val] : null;
        const weekData = valData ? valData[stateSchWeek] : null;
        const lessons = weekData ? weekData[stateSchDay] : [];
        
        if (lessons && lessons.length > 0) {
            container.innerHTML = lessons.map(l => `
                <div class="sch-card">
                    <div class="sch-num">${l.num}</div>
                    <div class="sch-info">
                        <div class="sch-time">${l.time}</div>
                        <div class="sch-subj">${l.subject}</div>
                        <div class="sch-teacher">${l.teacher || ''}</div>
                    </div>
                    <div class="sch-room">${l.room || ''}</div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="sch-empty">Уроків немає 🎉</div>';
        }
    };
})();