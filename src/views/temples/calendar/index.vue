<!-- <template>
  <FullCalendar ref="fullCalendar" :options="calendarOptions" />
</template>

<script lang="ts" setup>
  import { provide, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import FullCalendar from '@fullcalendar/vue';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import listPlugin from '@fullcalendar/list';

  // 给子组件定义一个ref变量
  const calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        initialView: 'dayGridMonth',
        locale: 'zh',
        firstDay: 1,
        buttonText: {
          today: '今天',
          month: '月',
          week: '周',
          day: '日',
          list: '周列表',
        },
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay listWeek',
        },
        height: 650,
        validRange: this.validRange,  //设置可显示的总日期范围
        events: [], //背景色 (添加相同时间的背景色时颜色会重叠) 
        datesSet: this.datesSet, //日期渲染；修改日期范围后触发
        eventClick: this.handleEventClick, //点击日程触发
        dateClick: this.handleDateClick, //点击日期触发
        eventDrop: this.calendarEventDropOrResize, //拖动事件触发
        eventResize: this.calendarEventDropOrResize, //缩放事件触发
        displayEventTime: false, //不显示具体时间
      },
      validRange: {
        start: '2021-09-01',
        end: moment().add(6, 'months').format('YYYY-MM-DD'),
      }
    }
  };


  function datesSet(info) {   //注意：该方法在页面初始化时就会触发一次
        console.log(info)
        // this.search()  //请求本页数据
        //虚拟数据
        this.calendarOptions.events = [{
              id: 111,
              title: '任务1',
              start: ‘2021-10-01’,
              end: ‘2021-10-11’
              color: ‘#ffcc99’,
              editable: true, //允许拖动缩放，不写默认就是false
              overlap: true, //允许时间重叠，即可以与其他事件并存，不写默认就是false
          },{
			id: 222,
              title: '任务2',
              start: ‘2021-10-12’,
              end: ‘2021-10-20’
              color: ‘#ffcc99’,
              editable: true, //允许拖动缩放
		}] 
      },
    handleEventClick(info) {},
    handleDateClick(info){},
    calendarEventDropOrResize(info){}
  }

</script> -->
