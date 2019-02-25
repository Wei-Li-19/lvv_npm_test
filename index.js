/**
 * 搜索表单组件
 * @props {Object} className 最外容器class样式
 * @props {Array | required } searchItems 搜索内容
 * @props {function} search 搜索回调
 *        @params {Object} search 搜索回调的参数, 删除了为undefined的key
 * @props {Boolean} fold 是否需要折叠
 * @props {Object} resetedValue 重置的初始值
 *
 * searchItems模板：
 * searchItems = [
    {
      label:表单label,
      key:字段,
      decorator:即 form 的 getFieldDecorator属性的option,
      tag: 表单控件DOM，默认<Input/>，
      spanLayouts： 每列占比, 默认{xs: 24, sm: 12, md: 8, lg: 8, },三等份
      formItemLayout： 表单label和wrapper占比，默认{ labelCol: { xs: { span: 24 }, sm: { span: 8 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, }, },
    }
  ]
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Input, Icon } from 'antd';
import { sliceArray, delUndefinedKey, _isNotNull } from './utils/utils';

const FormItem = Form.Item;
const spanLayouts = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 8,
}
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
class SearchBar extends React.PureComponent {
  state = {
    cols: 3,//默认3列
    isFold: this.props.fold,
  }

  _resetForm = () => {
    //重置判断
    if ('resetedValue' in this.props && _isNotNull(this.props.resetedValue)) {
      const currentValue = this.props.form.getFieldsValue()
      let newValue = {}
      Object.keys(currentValue).map(key => {
        if (key in this.props.resetedValue) {
          newValue[key] = this.props.resetedValue[key];
        } else {
          newValue[key] = undefined
        }
      })
      this.props.form.setFieldsValue(newValue)
    } else {
      this.props.form.resetFields()
    }
    this._handleSubmit();
  }

  _handleSubmit = (e) => {
    let event = e || window.event;
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const parsedValues = delUndefinedKey(values);
        if ('search' in this.props && typeof this.props.search === 'function') {
          this.props.search(parsedValues);
        }
      }
    });
  }
  toggleFold = ()=>{
    this.setState({
      isFold: !this.state.isFold
    })
  }
  sumSpan = (row=[])=>{
    return row.reduce((tt, { spanLayouts }={})=>{
      for (let i in spanLayouts){
        tt[i] = spanLayouts[i] || 0;
        tt[i] = tt[i] > 24 ? 24 : tt[i]
      }
      return tt;
    }, {})
  }
  //计算一行还剩多少空间
  calculateRemainSpanLayout = (spanLayouts={}) => {
    let remainLayout={}
    for (let i in spanLayouts) {
      remainLayout[i] = 24 - spanLayouts[i];
      remainLayout[i] = remainLayout[i] <= 0 ? 24 : remainLayout[i];
    }
    return remainLayout;
  }

  getSpanGrid = (rowItem) => {
    return rowItem.reduce((spans, item, index) => {
      spans += item.spanLayouts ? item.spanLayouts.md || 8 : 8;
      return spans;
    }, 0)
  }

  buttonRender = ()=>{
    const { fold } = this.props;
    const { isFold } = this.state;
    return (
      <div>
        <Button onClick={this._resetForm}>{'清除'}</Button>
        <Button type="primary" htmlType="submit" >{'搜索'}</Button>
        {fold && <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggleFold}>
          {isFold ? '展开' : '收起'} <Icon type={isFold ? 'down' : 'up'} />
        </a>}
      </div>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { className, searchItems,} = this.props;
    const { isFold } = this.state;

    //分行， 每行 cols 列
    let sliceSearchRow = sliceArray(searchItems, this.state.cols);
    sliceSearchRow = isFold ? sliceSearchRow.slice(0, 2) : sliceSearchRow;
    //判断最后一行占比 是否 大于 16，是则搜索按钮需要换行
    const ifAutoWrap = this.getSpanGrid(sliceSearchRow[sliceSearchRow.length - 1]) > 16;

    return (
      <Form onSubmit={this._handleSubmit} className={className}>
        {
          sliceSearchRow.map((rowItem, key) =>
            <Row key={key}>
              {
                rowItem.map((item, key) =>
                  //如果没有指定 key 就占空
                  item.key
                    ? <Col {...spanLayouts} {...item.spanLayouts} key={key}>
                        <FormItem {...formItemLayout} {...item.formItemLayout} label={item.label}>
                          {getFieldDecorator(item.key, {
                            ...item.decorator
                          })(
                            item.tag ? item.tag : <Input autoComplete='off' />
                          )}
                        </FormItem>
                      </Col>
                    : <Col {...spanLayouts} {...item.spanLayouts} key={key}></Col>
                )
              }
              {
                !ifAutoWrap && key + 1 === sliceSearchRow.length &&
                <Col {...spanLayouts} {...this.calculateRemainSpanLayout(this.sumSpan(rowItem))} styles={{display: flex,justifyContent: 'flex-end'}}>
                  {this.buttonRender()}
                </Col>
              }
            </Row>
          )
        }
        {ifAutoWrap && <Row>
          <Col {...spanLayouts}></Col>
          <Col {...spanLayouts}></Col>
          <Col {...spanLayouts} styles={{display: flex,justifyContent: 'flex-end'}}>
            {this.buttonRender()}
          </Col>
        </Row>}
      </Form>
    )
  }
}
SearchBar.defaultProps = {
  fold: false,
}
SearchBar.propTypes = {
  searchItems: PropTypes.array.isRequired,
  search: PropTypes.func,
  fold: PropTypes.bool,
  resetedValue: PropTypes.object,//重置的初始值
  className: PropTypes.string,
};
export default (Form.create()(SearchBar));
