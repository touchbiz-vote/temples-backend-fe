<template>
  <a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel" cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :label-col="labelCol" :wrapper-col="wrapperCol" :model="model" :rules="validatorRules">
        <a-form-model-item label="活动名称" required prop="act_name" hasFeedback>
          <a-input v-model="model.act_name" placeholder="请输入活动名称" />
        </a-form-model-item>

        <a-form-model-item label="开始时间" prop="act_start_time" hasFeedback>
          <a-date-picker showTime valueFormat="YYYY-MM-DD HH:mm:ss" v-model="model.act_start_time" />
        </a-form-model-item>

        <a-form-model-item label="结束时间" prop="act_end_time" hasFeedback>
          <a-date-picker showTime valueFormat="YYYY-MM-DD HH:mm:ss" v-model="model.act_end_time" />
        </a-form-model-item>

        <!-- <a-form-model-item label="性别"  prop="sex" hasFeedback>
          <j-dict-select-tag type="radio" v-model="model.sex"  :trigger-change="true" dictCode="sex"/>
        </a-form-model-item>

        <a-form-model-item label="年龄"  prop="age" hasFeedback>
          <a-input placeholder="请输入年龄" v-model="model.age"/>
        </a-form-model-item>

        <a-form-model-item label="生日"  prop="age" hasFeedback>
          <a-date-picker valueFormat="YYYY-MM-DD"  v-model="model.birthday"/>
        </a-form-model-item>

        <a-form-model-item label="邮箱"  prop="email" hasFeedback >
          <a-input  placeholder="请输入邮箱"  v-model="model.email"/>
        </a-form-model-item> -->

        <a-form-model-item label="备注" prop="remark" hasFeedback>
          <a-input type="textarea" v-model="model.remark" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage';

  export default {
    name: 'JeecgDemoModal',
    data() {
      return {
        title: '操作',
        visible: false,
        model: {},
        layout: {
          labelCol: { span: 3 },
          wrapperCol: { span: 14 },
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          act_name: [
            { required: true, message: '请输入活动名称!' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
          ],
          // act_start_time: [
          //   { required: false, type: 'datetime', message: '邮箱格式不正确', trigger: 'blur' }
          // ],
          // act_end_time: [
          //   { required: false, type: 'datetime', message: '邮箱格式不正确', trigger: 'blur' }
          // ]
        },
        url: {
          add: '/online/cgform/api/form/1d3cbef5d80b47d38f16028041044c39',
          edit: '/online/cgform/api/form/1d3cbef5d80b47d38f16028041044c39',
        },
      };
    },
    created() {},
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      close() {
        this.$refs.form.resetFields();
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate((valid) => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            // httpurl+= this.model.tableId
            httpAction(httpurl, this.model, method)
              .then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.$emit('ok');
                } else {
                  that.$message.warning(res.message);
                }
              })
              .finally(() => {
                that.confirmLoading = false;
                that.close();
              });
          }
        });
      },
      handleCancel() {
        this.close();
      },
    },
  };
</script>

<style scoped></style>
