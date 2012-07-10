require 'json'

TECH = {
    'html'  => ['HTML', 'HyperText Markup Language'],
    'xhtml' => ['XHTML', 'eXtensible HyperText Markup Language'],
    'css'   => ['CSS', 'Cascading Style Sheets'],
    'js'    => ['JS', 'JavaScript'],
    'php'   => ['PHP', 'PHP: Hypertext Preprocessor'],
    'mysql' => ['MySQL'],
    'ruby'  => ['Ruby'],
    'rails' => ['RoR', 'Ruby on Rails']
}

MONTHS = {
    '01' => 'Jan',
    '02' => 'Feb',
    '03' => 'Mar',
    '04' => 'Apr',
    '05' => 'May',
    '06' => 'Jun',
    '07' => 'Jul',
    '08' => 'Aug',
    '09' => 'Sep',
    '10' => 'Oct',
    '11' => 'Nov',
    '12' => 'Dec'
}

json_list = []
json_promoted = []

jsons = Dir.glob(File.join('js', 'posts', '*.json')).collect do |json|
  JSON.parse(File.read(json).force_encoding('utf-8'))
end.sort_by do |json|
  json['date']
end.reverse

jsons.each.with_index do |json, i|
  t_size = json['technologies'].size
  date = json['date'].split('-')
  File.open(File.join('_posts', "#{json['date']}-#{json['id']}.html"), 'w') do |file|
    file.write(<<EOF
---
layout: default
title: #{json['title']}
cite: #{json['cite']}
#{i > 0 ? 'prevlink: /' + jsons[i-1]['date'].split('-').join('/') + '/' + jsons[i-1]['id'] + '.html' + 10.chr : ''}#{jsons[i+1] ? 'nextlink: /' + jsons[i+1]['date'].split('-').join('/') + '/' + jsons[i+1]['id'] + '.html' + 10.chr : ''}---

                <section id="portfolio">{% include arrows.html %}
                    <div class="portfolio post">
                        <h2>Portfolio</h2>
                        <h3>#{json['title']} <cite>#{json['cite']}</cite></h3>
                        <p class="translate translate-en">#{json['description']['en']}</p>
                        <p class="translate translate-pl">#{json['description']['pl']}</p>
                        <ul class="technologies">
#{json['technologies'].collect.with_index {|t, i| '                            <li' + (i + 1 == t_size ? ' class="last"' : '') + '>' + (TECH[t[0].to_s][1] ? '<abbr title="' + TECH[t[0].to_s][1] + '">' : '') + TECH[t[0].to_s][0] + (TECH[t[0].to_s][1] ? '</abbr>' : '') + (t[1] ? ' ' + t[1].to_s : '') + '</li>'}.join(10.chr)}
                            <li class="date"><span class="#{MONTHS[date[1]].downcase}">#{MONTHS[date[1]]}</span> #{date[0]}</li>
#{json['preview'] ? '                            <li class="preview"><a href="/' + json['id'] + '/" target="_blank">See preview</a></li>' + 10.chr : ''}
#{json['online'] ? '                            <li class="online"><a href="' + json['url'] + '" target="_blank" rel="nofollow">See online</a></li>' + 10.chr : ''}                        </ul>
                        <img src="/images/posts/#{json['id']}.jpg" alt="Preview" class="preview" />
                    </div>
                    <!-- / post item -->
                </section>
                <!-- / portfolio -->
EOF
)
  end
  json_list.push(json['id'])
  json_promoted.push(json) if json['promoted']
end

File.open(File.join('js', 'portfolio.json'), 'w') { |file| file.write(json_list.to_json) }
File.open(File.join('js', 'promoted.json'), 'w') { |file| file.write(json_promoted.collect{|json| json['id']}.to_json) }

slider =  "                        <ul>\n"
json_promoted[0..4].each do |json|
slider += "                            <li>\n                                <a href=\"/#{json['date'].split('-').join('/')}/#{json['id']}.html\"><img src=\"/images/posts/#{json['id']}.jpg\" alt=\"#{json['title']}\" /></a>\n                            </li>\n"
end
slider += "                        </ul>"

File.open(File.join('_includes', 'slider.html'), 'w') { |file| file.write(slider) }