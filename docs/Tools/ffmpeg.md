[TOC]

### 常用参数说明:
```

`-re` readrate设置读取速度,不要一次读完
`-i` 指定输入对象
`-f mpegts` 指定输出流格式,也可指定输入格式
`-y` 文件存在则覆盖
`-vcodec,-acodec,-scodec` 视频编码,音频编码,字幕编码	
`-c:v` alias -codec:v
`-map 0` 代表所有音轨,可对单独某条音轨进行操作
    `0:v` 代表提取所有视频流（一般视频流只有1路）
    `0:a:1` 代表提取第2路音频流(下标)
`-stream_loop`  该媒资循环次数:Loop 0 means no loop, loop -1 means infinite loop.
`concat` 连接音视频
```

```
libsvtav1
libx264
libx265
```

**官方文档:** https://ffmpeg.org/ffmpeg.html
[学习使用](https://github.com/leandromoreira/ffmpeg-libav-tutorial/blob/master/README-cn.md "学习使用")

### 常用命令
#### 查看音频视频文件信息并输出为json格式
`ffprobe -i cdn_test.ts -v quiet -print_format json -show_format -show_streams`

#### 转 av1 编码 -#特定的ffmpeg版本,用于转码av1
`/home/ljy/ffmpegav1   -i stream/test.mp4 -c:v  libsvtav1  -c:a copy   stream/testav1.mp4`

#### 任意转265
`ffmpeg -i test.mp4  -vcodec  libx265  -c:a aac output265.mp4`

#### 任意转264
`ffmpeg -i 2.ts   -c:v libx264   -c:a copy  22.ts`

#### 任意转265 + 参数
`ffmpeg -i test.mp4  -vcodec  libx265 -preset slow -b:v 2000k  -crf  21 -strict -2 output265.mp4`
-preset slow: 设置编码速度为慢速, 质量更好.视频将以2000kbps的平均比特率进行编码，-crf 21: 设置恒定质量为中高档，-strict -2: 设置音频编码器为默认值 aac, 在较新的FFmpeg版本中，aac编码器默认是被禁用的，所以需要显式地启用它

#### 转为 aac 音频码 -当正常方法无法转换时
`ffmpeg -i combine-test2.ts  -map 0 -c:v copy -c:a aac -strict -2 combine-x.ts`

#### ffmpeg之视频多音轨剪切10分钟:保留多音轨
`ffmpeg -i cs.mkv -y -ss 00:00:00 -to 00:10:00  -map 0:v  -vcodec copy -map 0:a -acodec copy out3.mp4`

#### 裁剪保留字幕
`ffmpeg -i cs.mkv -y -ss 00:00:00 -to 00:10:00  -map 0:v  -vcodec copy -map 0:a -acodec copy -map 0:s -scodec copy out4.mkv`
对应 HH:mm:ss.MMM , MMM 为毫秒, -scodec copy: 将字幕流直接拷贝到输出文件中, 不重新编码, 可以保持字幕的原始编码格式和质量。


#### 视频裁剪并指定码率 bitrate
`ffmpeg -i cs.mkv   -b:v 15000k -bufsize 15000k -vcodec copy -acodec copy -ss 00:00:00 -to 00:10:00   output.mp4  -y   -vcodec copy -acodec copy -ss 00:00:00 -to 00:39:00 test_cut.mp4 -y`


#### 转 av1 编码并改变视频码率
(降低码率需转换编码&&合适的ffmpeg 版本)
`./ffmpegav1   -i stream/test.mp4 -b:v 15000k -bufsize 15000k -c:v  libsvtav1  -c:a copy   stream/testav1.mp4`



#### 转分辨率
`ffmpeg -i input_file -vf "scale=1280:720" -c:a copy output_file`
转换分辨率和码率, (不指定视频编码会使用默认的, 最好指定) 1280:720 1920:1080 854:480
`ffmpeg -i kimi_with_time_4l.ts -vf scale=1280:720 -b:v 1M -bufsize 1M -c:v libx264 -c:a copy 7201M.ts`


#### 在视频上加走动时间
(这个对ffmpeg有要求，需要有字体裤)
`/home/ljy/ffmpegav1 -i /home/bonbon/asset/expanse.ts -vf drawtext=fontfile=/usr/share/fonts/segoeui.ttf:fontcolor=orange:fontsize=80:y=h/15:x=w/18:text='%{pts:hms}' -c:v libx264 -g 120 -keyint_min 120 -sc_threshold 0 -c:a aac -f mpegts /home/bonbon/expanse_with_time.ts -y`

#### 调 GOP 大小
`ffmpeg -i input.mp4 -c:v libx264 -g 15 -keyint_min 15 -sc_threshold 0 output.mp4`
`15 * 40 为 GOP 时长`

#### 推 MP4 流-向内网服务器,在支持 MP4 流格式的版本后(基本都已支持)
`ffmpeg -re -stream_loop -1 -i rank.ts -bsf:a aac_adtstoasc -vcodec copy -acodec copy -f mp4 -movflags empty_moov+default_base_moof http://192.168.1.143:23341/live/sample1.mp4`

#### 将一个文件循环生成 fmp4 的 m3u8
`/home/ljy/ffmpegav1 -re -stream_loop -1 -i /home/ljy/stream/sample1_4k60_libx265_aac.ts -bsf:a aac_adtstoasc  -codec copy -hls_playlist 1 -use_template 1 -hls_segment_type fmp4 -hls_time 2 -f hls -hls_flags delete_segments /home/nginx/download/sample1_4k60_libx265_aac/sample1_4k60_libx265_aac.m3u8`


#### 四宫格流转码命令
`ffmpeg -i http://204.188.216.178:13811/live/pt_jK8qbRUeI8qNMLCC_720p.ts -i http://204.188.216.178:13811/live/pt_2qZ7HgcBTY6p4rRoImX3nPLS_720p.ts -i http://204.188.216.178:13811/live/lou03n5lzubyfxzpa56v8lx15t0dswro.ts -i http://204.188.216.178:13811/live/pt_ScQBL06LuJftF_720p.ts -map 0:v -map 0:a -map 1:a -map 2:a -map 3:a -filter_complex [0:v]pad=1920:1080[0];[0:v]scale=960:540[temp0];[1:v]scale=960:540[temp1];[2:v]scale=960:540[temp2];[3:v]scale=960:540[temp3];[0][temp0]overlay=0:0[1];[1][temp1]overlay=960:0[2];[2][temp2]overlay=0:540[3];[3][temp3]overlay=960:540 -sws_flags neighbor -max_muxing_queue_size 1099 -c:v nvenc_h264 -pix_fmt yuv420p -g 24 -preset:v fast -sc_threshold 0 -c:a copy -metadata:s:a:0 language=cb0 -metadata:s:a:1 language=cb1 -metadata:s:a:2 language=cb2 -metadata:s:a:3 language=cb3 http://mob_s.cpitn.com:23817/live/m7_CJyNhosvaagEarvaaTV_480p.ts -y`

#### 四宫格推转完码文件流命令/推多音轨流作为直播流命令
`(/home/ljy/stream/ffmpeg -re -f concat -safe 0 -i <(for i in {1..100000}; do printf "file '%s'\n" /home/ljy/stream/cdn_test.ts; done) -map 0:v -map 0:a -vcodec copy -acodec copy -f mpegts http://192.168.1.151:23817/live/source_wdjm.ts >/dev/null 2>&1 &)`




```
ffmpeg \
-y \ # 全局参数
-c:a libfdk_aac \ # 输入文件参数
-i bunny_1080p_60fps.mp4 \ # 输入文件
-c:v libvpx-vp9 -c:a libvorbis \ # 输出文件参数
bunny_1080p_60fps_vp9.webm # 输出文件
```

#### 当流有很多音轨时只推选中的
通过 -map 0:a:0 指定第几个音轨, 下标选中 0 为 第一个. 下方命令选中前 1 和 2 个音轨, 并推入源站
 `ffmpeg -re -f concat -safe 0 -i <(for i in {1..100000}; do printf "file '%s'\n" /home/media/pt_5F29FFA21543715C0CE1F_720p_2M.ts; done) -map 0:v -map 0:a:0 -map 0:a:1  -vcodeccopy -acodec copy -f mpegts http://192.168.1.121:23829/live/source_task_udp_265ts.ts`

### 命令解析
`ffmpeg 读取文件:无限循环读取 指定输入地址 "stream_addr" -c:v libx264 本次使用 264 编码输出(只要命令还在执行就持续占用cpu进行转换) 指定输出 "" -vcodec copy(使用原视频的 vcodec ) 指定第二个输出(可以多个) -f 指定输出的封装编码 输出地址 挂在后台并向指定地址输出日志`
`(/home/ljy/stream/ffmpeg -y  -stream_loop -1  -re -i  "{stream_addr}" -c:v libx264  -c:a aac   "{video_path + video_name + '.ts'}"    -vcodec copy -acodec copy  -f mpegts http://192.168.1.151:23817/live/LEARN.ts >/dev/null 2>&1 &)`

`注意 -stream_loop 不要写在 -i 后边, 会报错: 无选项`
