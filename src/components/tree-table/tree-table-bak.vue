<template>
	<div class="tree-table">
		<div class="tree-head">
			<table>
				<tr>
					<td class="td1">职位名称</td>
					<td class="td2">负责人</td>
					<td class="td3" @click="isDesc=!isDesc">
						创建时间
						<div class="arrow">
							<span class="up-arrow" :class="{'sort':isDesc}"></span>
							<span class="down-arrow" :class="{'sort':!isDesc}"></span>
						</div>
					</td>
					<td class="td4">工作经验</td>
					<td class="td5">发布时间</td>
					<td class="td6">操作</td>
				</tr>
			</table>
		</div>
		<div id="scrollWrap" class="tree-wrap">
			<div class="tree-body">
				<table v-if='treeDataSource.length>0'>
					<tbody>
						<tr>
							<td>
								<tree-item
									v-for="(model,i) in treeDataSource"
                  :key="'root_node_'+i"
									:root="0"
									:num="i"
									@actionFunc="actionFunc"
									@deleteFunc="deleteFunc"
									:nodes="treeDataSource.length"
									:trees.sync="treeDataSource"
									:model.sync="model">
								</tree-item>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'treeTable',
		props: ['list'],
		data() {
			return {
				isDesc: false,
				treeDataSource: []
			}
		},

		watch: {
			'list': {
				handler() {
					console.log('ddddd')
					this.initTreeData()
				},
				deep: true
			},
			isDesc(nelVal, oldVal) {
				this.$emit('orderByFunc', nelVal)
			}
		},
		computed: {
		},
		methods: {
			initTreeData() {
				// console.log('处理前的:', JSON.parse(JSON.stringify(this.list)))
				// 这里一定要转化，要不然他们的值监听不到变化
				let tempData = JSON.parse(JSON.stringify(this.list))
				let reduceDataFunc = (data, level) => {
					data.map((m, i) => {
						m.isExpand = false
						m.children = m.children || []
						m.level = level
						m.bLeft = level === 1 ? 34 : (level - 2) * 16 + 34
						m.Experience = m.Experience || '无'
						if (m.children.length > 0) {
							reduceDataFunc(m.children, level + 1)
						}
					})
				}
				reduceDataFunc(tempData, 1)
				// console.log('处理后的:', tempData)
				this.treeDataSource = tempData
			},
			getMore() {
				alert('滚动到底部加载更多')
				// 滚动到最后
				$('#scrollWrap').mCustomScrollbar('scrollTo', 'top', {
					scrollInertia: 0
				})
			},
			actionFunc(m) {
				this.$emit('actionFunc', m)
			},
			deleteFunc(m) {
				this.$emit('deleteFunc', m)
			}
		},
		components: {
			treeItem: {
				name: 'treeItem',
				props: ['model', 'num', 'nodes', 'root', 'trees'],
				data() {
					return {
						parentNodeModel: null
					}
				},
				computed: {
					colSpan() {
						return this.root === 0 ? '' : 6
					},
					tdClass() {
						return this.root === 0 ? 'td-border' : 'not-border'
					},
					levelClass() {
						return this.model ? 'leve-' + this.model.level : ''
					},
					childNodeClass() {
						return this.root === 0 ? '' : 'child-node'
					},
					otherNodeClass() {
						return this.model ? 'other-node-' + this.model.level : ''
					}
				},
				watch: {
					'model': {
						handler() {
							console.log('对象变化', this.model.isExpand)
						},
						deep: true
					}
				},
				methods: {
					getParentNode(m) {
						// 查找点击的子节点
						var recurFunc = (data, list) => {
							data.forEach((l) => {
								if (l.id === m.id) this.parentNodeModel = list
								if (l.children) {
									recurFunc(l.children, l)
								}
							})
						}
						recurFunc(this.trees, this.trees)
					},
					open(m) {
						m.isExpand = !m.isExpand
					},
					deleteFunc(m) {
						this.$emit('deleteFunc', m)
						// this.getParentNode(m)
						// console.log(this.parentNodeModel)
						// if (this.parentNodeModel.hasOwnProperty('children')) {
						// 	console.log('父级是跟节点', this.parentNodeModel)
						// 	this.parentNodeModel.children.splice(this.parentNodeModel.children.indexOf(m), 1)
						// } else if (this.parentNodeModel instanceof Array) {
						// 	console.log('跟节点', this.parentNodeModel)
						// 	this.parentNodeModel.splice(this.parentNodeModel.indexOf(m), 1)
						// }
					},
					actionFunc(m) {
						this.$emit('actionFunc', m)
					}
				},
				filters: {
					formatDate: function(date) {
            // 后期自己格式化
						return date //Utility.formatDate(date, 'yyyy/MM/dd')
					}
				},
				template: `
					<div :class="tdClass">
					<span class="before-line" v-if="root !== 0 && nodes !== 1" :style="{'left':model.bLeft + 'px'}"></span>
					<table>
					<tr>
						<td :colspan="colSpan">
							<table>
									<tr class="leve" :class="levelClass">
										<td class="td1">
											<div class="td-title" @dblclick="open(model)">
												<span v-if="model.children.length > 0" class="tree-close" :class="{'tree-open':model.isExpand}" @click="open(model)"></span>
												<a class="ellipsis">
													<i class="t-icon m-dep"></i>
													<span :title="model.ObjectName">{{model.ObjectName}}</span>
												</a>
											</div>
										</td>
										<td class="td2">
											{{model.ResponsibleName}}
										</td>
										<td class="td3">{{model.CreateTime|formatDate}}</td>
										<td class="td4">
											<span :title="model.Experience" class="ellipsis">{{model.Experience}}</span>
										</td>
										<td class="td5">{{model.BelongTo}}天</td>
										<td class="td6">
											<a class="reset" href="javascript:;" @click="actionFunc(model)">编辑</a>
											<i class="line"></i>
											<a class="delete" href="javascript:;" @click="deleteFunc(model)">删除</a>
										</td>
									</tr>
							</table>
						</td>
					</tr>
					</table>
					<div v-show="model.isExpand" class="other-node" :class="otherNodeClass">
						<tree-item
							v-for="(m, i) in model.children"
							:key="String('child_node'+i)"
							:num='i'
							:root="1"
							@actionFunc="actionFunc"
							@deleteFunc="deleteFunc"
							:nodes.sync='model.children.length'
							:trees.sync='trees'
							:model.sync="m">
						</tree-item>
					</div>
					</div>
				`
			}
		},
		mounted() {
			const vm = this
			vm.$nextTick(() => {
				vm.initTreeData()
				// $('#scrollWrap').mCustomScrollbar({
				// 	scrollInertia: 200, // 滚动延迟 0位没有
				// 	autoHideScrollbar: true,
				// 	scrollbarPosition: 'outside',
				// 	axis: 'y',
				// 	mouseWheel: {
				// 		preventDefault: true,
				// 		disableOver: ['div.leftDialog', 'div.rightDialog', 'div.transferDia', 'div.el-dialog__wrapper', 'div.initPopBox', 'div.calPopBox', 'div.ql-editor:focus', 'input:focus', 'textarea:focus']
				// 	},
				// 	advanced: {
				// 		autoScrollOnFocus: false
				// 	},
				// 	autoExpandScrollbar: false,
				// 	theme: 'minimal-dark', // minimal-dark dark
				// 	mouseWheelPixels: 800,
				// 	callbacks: {
				// 		onTotalScroll: function() {
				// 			vm.getMore()
				// 		}
				// 	}
				// })
			})
		}
	}
</script>

<style lang="less">
	.tree-table {
		width: 100%;
		position: relative;
		.center {
			text-align: center;
		}
		table {
			width: 100%;
			text-align: center;
			border-collapse: collapse;
			border-spacing: 0;
			td {
				word-break: break-all;
				word-wrap: break-word;
				font-size: 12px;
			}
		}
		.td-border {
			border-bottom: 1px solid #E8E8E8;
			.leve{
        // 屏蔽双击不能选择文本样式
        -webkit-user-select:none;
        -moz-user-select:none;
        -o-user-select:none;
        user-select:none;
				&:hover {
					background-color: #f7f9ff;
				}
			}
		}
		th,
		td {
			font-weight: 400;
			text-align: left;
		}
		.td1 {width: 260px;padding-left:30px;}
		.td2 {width: 100px;}
		.td3 {width: 120px;}
		.td4 {width: 220px;}
		.td5 {width: 100px;}
		.td6 {width: 140px;}
		.p20{padding-left:20px;}
		.leve-1 .td1 {padding-left:30px;}
		.leve-2 .td1{padding-left:46px;}
		.leve-3 .td1{padding-left:62px;}
		.leve-4 .td1{padding-left:78px;}
		.leve-5 .td1{padding-left:90px;}
		.leve-6 .td1{padding-left:106px;}
		.leve-7 .td1{padding-left:122px;}
		.leve-8 .td1{padding-left:138px;}
		.leve-9 .td1{padding-left:154px;}
		.td4 {
			.unvisibie {
				visibility: hidden;
			}
			.ellipsis{
				display: block;
				max-width:200px;
			}
			.iconfont {
				color: #414959;
				position: relative;
				top: 0px;
				left: 5px;
				font-size: 14px;
			}
		}
		> div{
			position: absolute;
			width:100%;
		}
		.line-height {
			height: 40px;
			line-height: 40px;
		}

		.tree-head{
			.line-height;
			td{
				color: rgba(0,0,0,0.45);
				border-bottom: 2px solid #E8E8E8;
			}
			.arrow {
				position: relative;
				display: inline-block;
				width: 16px;
				height: 16px;
				background: #fff;
				span{
					position: absolute;
					display: block;
					width: 0;
					height: 0;
					left:0;
					border-style: solid;
					border-width:4px;
				}
				.up-arrow {
					top:3px;
					border-color:transparent transparent #ddd transparent;
					&.sort{
						border-bottom-color: #3C4454;
					}
				}
				.down-arrow {
					top:12px;
					border-color:#ddd transparent transparent transparent;
					&.sort{
						border-top-color: #3C4454;
					}
				}
			}
		}
		.ellipsis{
			overflow:hidden;
			white-space:nowrap;
			text-overflow:ellipsis;
		}
		.tree-wrap {
			top:40px;
		}
		.tree-body {
			table{
				table-layout: fixed;
			}
			td {
				.line-height;
				color: rgba(0,0,0,0.85);
				font-size: 14px;
				.reset {
					color: #1890FF;
				}
				.delete {
					color: #F5222D;
				}
				.line {
					display: inline-block;
					width: 1px;
					background: rgba(0,0,0,0.09);
					margin: 0 11px;
					height: 14px;
				}
			}
			.td-title{
				position: relative;
				a {
					display: block;
        }
				.tree-close,.tree-open{
					position: absolute;
					width: 0;
					height: 0;
					border-color: #999;
					border-style: solid;
					cursor: pointer;
					border-width:5px;
    				z-index: 2;
					}
					.tree-close{
						left: -12px;
						top: 14px;
						border-color: transparent transparent transparent #AAAAAA;
					}
					.tree-open{
						left: -17px;
						top: 17px;
						border-color: #AAAAAA transparent transparent;
					}
			}
			.leve-1 .td-title a { width: 230px; }
			.leve-2 .td-title a { width: 200px; }
			.leve-3 .td-title a { width: 170px; }
			.leve-4 .td-title a { width: 140px; }
			.leve-5 .td-title a { width: 110px; }
			.leve-6 .td-title a { width: 80px; }
			.leve-7 .td-title a { width: 50px; }
			.leve-8 .td-title a { width: 20px; }
			.other-node {
				position: relative;
				> .not-border:not(:last-child) {
					position: relative;
					.before-line {
						content: '';
						position: absolute;
						width: 1px;
						height: 100%;
						background-color: #E8E8E8;
						border: none;
						top: -20px;
						z-index: 1;
						left: 34px;
					}
				}
			}
			.not-border {
				.td-title {
					&::before{
						content: '';
						position: absolute;
						width: 1px;
						height: 40px;
						background-color: #E8E8E8;
						border: none;
						left: -12px;
						top: -20px;
						z-index: 1;
					}
					&::after {
						content: '';
						left: -11px;
						position: absolute;
						right: auto;
						background-color: #E8E8E8;
						height: 1px;
						top: 19px;
						width: 16px;
						z-index: 1;
					}
				}
			}
		}

	}
</style>

