import { storage } from './lib'

if (storage.get('theme') === 'dark') {
	import('antd/dist/antd.dark.min.css')
} else {
	import('antd/dist/antd.min.css')
}